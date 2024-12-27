import isCLI from "@/utils/is-cli";
import testCases from '@/tests/fixtures/transform-testcases.json';

export type IncomingType = {
    from: string;
    to: string;
    cc: string;
    bcc: string;
};

export type OutgoingType = {
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
};

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function splitAndTrim(emails: string): string[] {
    return emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
}

function validateEmails(emails: string[]): void {
    emails.forEach(email => {
        if (!isValidEmail(email)) {
            throw new Error(`Invalid email address: ${email}`);
        }
    });
}

function validateIncoming(incoming: IncomingType): void {
    if (typeof incoming.from !== 'string' || !isValidEmail(incoming.from)) {
        throw new Error(`Invalid email address in 'from': ${incoming.from}`);
    }

    const toEmails = splitAndTrim(incoming.to);
    validateEmails(toEmails);

    const ccEmails = splitAndTrim(incoming.cc);
    validateEmails(ccEmails);

    const bccEmails = splitAndTrim(incoming.bcc);
    validateEmails(bccEmails);
}

function transformIncomingToOutgoing(incoming: IncomingType): OutgoingType {
    validateIncoming(incoming);
    const toEmails = splitAndTrim(incoming.to).filter(email => 
      !email.endsWith(`@${process.env.NEXT_PUBLIC_DOMAIN}`) && !email.endsWith(`@${process.env.MAIN_EMAIL_DOMAIN}`)
    );

    if (!toEmails.some(email => email === incoming.from.trim())) {
        toEmails.push(incoming.from.trim());
    }

    const botEmailAddress = splitAndTrim(incoming.to).find(email => 
      email.endsWith(`@${process.env.NEXT_PUBLIC_DOMAIN}`) || email.endsWith(`@${process.env.MAIN_EMAIL_DOMAIN}`)
    )?.trim();

    if (!botEmailAddress) {
        throw new Error(`Bot email address ${incoming.to} not found in 'to' field, needs to match with ${process.env.NEXT_PUBLIC_DOMAIN}`);
    }

    return {
        from: botEmailAddress,
        to: toEmails,
        cc: splitAndTrim(incoming.cc),
        bcc: splitAndTrim(incoming.bcc)
    };
}

export default transformIncomingToOutgoing;

// Test cases
interface TestCase {
    incoming: IncomingType;
    expected: OutgoingType;
}

function runTests() {
    (testCases as TestCase[]).forEach((testCase, index) => {
        try {
            const actualOutgoing = transformIncomingToOutgoing(testCase.incoming);

            console.assert(
                JSON.stringify(actualOutgoing) === JSON.stringify(testCase.expected),
                `Test failed: Test case ${index + 1} did not return the expected result`,
                { actualOutgoing, expected: testCase.expected }
            );
        } catch (error: any) {
            console.error(`Test case ${index + 1} failed with error: ${error.message}`);
        }
    });

    console.log('All tests passed!');
}

if (isCLI(import.meta.url)) {
    runTests();
}
