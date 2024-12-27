import { ComponentProps, ReactNode, useMemo } from "react";
import { BookText } from "lucide-react";
import Link from "next/link";
import { MarketingEmailForm } from "@/components/marketing-email-form";
import handleEmailToResendServerAction from "@/actions/server-action-add-email-to-resend";

interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
  description: ReactNode;
  title: ReactNode;
}

function Feature({ title, description, className, ...props }: FeatureProps) {
  return (
    <div className="p-6 border dark:border-zinc-700 rounded-xl" {...props}>
      <h4 className="mb-4 font-semibold">{title}</h4>
      <p className="text-sm">{description}</p>
    </div>
  );
}

export default async function Index() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="flex flex-col min-h-[100vh]">
      <header className="border-b dark:border-zinc-700  px-6 lg:px-0">
        <div className="max-w-4xl mx-auto flex h-16 items-center">
          <Link className="font-bold flex flex-row" href="/">
            <BookText className="h-6 w-6 mr-2" />
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </Link>
        </div>
      </header>
      <main>
        
        <div className="my-8 md:my-20 max-w-4xl mx-auto px-6 lg:px-0">
          <h1 className="max-w-[460px] mb-9 font-extrabold leading-tight text-5xl">
            Your GPT Writing Assistant in Slack.
          </h1>
          <p className="max-w-[640px] text-xl text-zinc-400">
            Elevate Your Content Editing by Integrating Your OpenAI Assistant into Slack.
          </p>
        </div>

        <div className="my-8 md:my-20 max-w-4xl mx-auto px-6 lg:px-0">
          <h2 className="mb-10 text-2xl font-bold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <Feature
              description={
                <>
                  Effortlessly connect your OpenAI Assistant directly into your Slack workspace.
                </>
              }
              title="Seamless Slack Integration"
            />
            <Feature
              description={
                <>
                  Customize your OpenAI Assistant to suit your team{"'"}s specific needs and preferences with ease.
                </>
              }
              title="Full Control"
            />
            <Feature
              description={
                <>
                  Design and utilize custom prompts to meet your team{","}s unique requirements, ensuring accurate and relevant responses.
                </>
              }
              title="Tailored Prompts"
            />
            <Feature
              description={
                <>
                  Upload documents for rapid, AI-assisted edits and styleproofing, saving your team valuable time.
                </>
              }
              title="Quick Document Uploads"
            />
            <Feature
              description={
                <>
                  Integrate the assistant into any conversation, enhancing teamwork and keeping everyone aligned.
                </>
              }
              title="Enhanced Collaboration"
            />
            <Feature
              description={
                <>
                  Streamline your content editing process with AI support, boosting efficiency and productivity.
                </>
              }
              title="Workflow Optimization"
            />
          </div>
        </div>

        <div className="my-8 md:my-20 max-w-4xl mx-auto px-6 lg:px-0">
          <h2 className="text-3xl font-bold">Join Our Beta Testers!</h2>
          <p
            className="max-w-[640px] text-xl text-zinc-400 mt-2 mb-6"
          >
            Be one of the first to test and shape our tool.
          </p>
          <MarketingEmailForm 
            handleEmailToResendServerAction={handleEmailToResendServerAction}
          />
        </div>
      </main>
      <footer className="border-t border-zinc-700 px-6 lg:px-0">
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-end">
          <span className="text-sm text-zinc-500">
          © {year} Cassie-GPT.
          </span>
        </div>
      </footer>
    </div>
  );
}