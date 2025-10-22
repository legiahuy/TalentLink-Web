import { SignupForm } from '@/components/features/auth/signup-form';

export default function SignupPage() {
    return (
        <div className="flex h-screen">
            {/* Left side - Fixed background */}
            <div className="bg-muted relative hidden w-1/2 items-center justify-center p-10 lg:flex xl:w-2/5">
                <img
                    src="/auth-photo-1.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />

                {/* Logo in top left */}
                <div className="absolute top-6 left-6 z-20">
                    <img
                        src="/TalentLink.svg"
                        alt="TalentLink Logo"
                        className="h-8 w-auto"
                    />
                </div>

                <div className="relative z-10 flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
                    <div className="space-y-5 text-white">
                        <h1 className="text-4xl leading-tight font-bold">
                            Connect Talent. Build Careers. Create Success.
                        </h1>
                        <p className="text-lg leading-relaxed opacity-90">
                            Join thousands of professionals who have found their
                            dream opportunities through our platform. Your next
                            career move starts here.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Scrollable form */}
            <div className="flex flex-1 flex-col overflow-y-auto">
                {/* Mobile header */}
                <div className="p-4 lg:hidden">
                    <div className="flex justify-center gap-2">
                        <img src="/TalentLink.svg" />
                    </div>
                </div>

                {/* Form container */}
                <div className="flex flex-1 items-center justify-center p-4 py-10 lg:p-10">
                    <div className="w-full max-w-sm">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
