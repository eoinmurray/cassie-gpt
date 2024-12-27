import isCLI from '@/utils/is-cli';

export default function parseCleanSubject(rawSubject: string): string {
  let cleanedSubject = rawSubject.trim();
  cleanedSubject = cleanedSubject.replace(/\s+/g, ' ');
  while (/^(re:|fwd:)\s*/i.test(cleanedSubject)) {
    cleanedSubject = cleanedSubject.replace(/^(re:|fwd:)\s*/i, '');
  }
  // cleanedSubject = cleanedSubject.replace(/\b\w/g, char => char.toUpperCase());
  return cleanedSubject;
}

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    console.error(`FAILED: ${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  } else {
    console.log(`PASSED: ${message}`);
  }
}

async function runTests() {
  assertEqual(
    parseCleanSubject('   meeting reminder   '),
    'Meeting Reminder',
    'should trim leading and trailing whitespaces'
  );

  assertEqual(
    parseCleanSubject('meeting   reminder'),
    'Meeting Reminder',
    'should reduce multiple spaces between words to a single space'
  );

  assertEqual(
    parseCleanSubject('Re: meeting reminder'),
    'Meeting Reminder',
    'should remove common prefixes like "Re:" without case sensitivity'
  );

  assertEqual(
    parseCleanSubject('Fwd: meeting reminder'),
    'Meeting Reminder',
    'should remove common prefixes like "Fwd:" without case sensitivity'
  );

  assertEqual(
    parseCleanSubject('meeting reminder'),
    'Meeting Reminder',
    'should capitalize the first letter of each word'
  );

  assertEqual(
    parseCleanSubject('  re:   meeting  Reminder   '),
    'Meeting Reminder',
    'should handle mixed cases and spaces properly'
  );

  assertEqual(
    parseCleanSubject('team meeting tomorrow'),
    'Team Meeting Tomorrow',
    'should handle subjects without prefixes correctly'
  );

  assertEqual(
    parseCleanSubject('Meeting Reminder'),
    'Meeting Reminder',
    'should not change an already clean subject'
  );

  assertEqual(
    parseCleanSubject('Re: re: fwd: FWD: meeting reminder'),
    'Meeting Reminder',
    'should handle multiple prefixes correctly'
  );

  assertEqual(
    parseCleanSubject('FWD: Re: fwd:   re: meeting  reminder   '),
    'Meeting Reminder',
    'should handle multiple mixed case prefixes and excessive spaces correctly'
  );
}

if (isCLI(import.meta.url)) {
  await runTests();
}
