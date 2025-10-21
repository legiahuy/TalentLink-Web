
import { SignupForm } from "@/components/features/auth/SignUpForm"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-10">
      <div className="bg-muted relative hidden lg:flex lg:col-span-3 items-center justify-center p-10">
        <img
          src="/auth-photo-1.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-10 flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">

          <div className="space-y-5 text-white">
            <h1 className="text-4xl font-bold leading-tight">
              Connect Talent. Build Careers. Create Success.
            </h1>
            <p className="text-lg leading-relaxed opacity-90">
              Join thousands of professionals who have found their dream opportunities
              through our platform. Your next career move starts here.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-7">
        <div className="flex justify-center gap-2 md:justify-start">
          <img src="/TalentLink.svg" />

        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}
