import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add form validation and API call
        console.log('Form data:', formData);
    };

    return (
        <form
            className={cn('flex flex-col gap-3', className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="mb-3 flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">
                        Tìm tài khoản của bạn
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Nhập email bên dưới để đặt lại mật khẩu
                    </p>
                </div>

                {/* Email - Full width */}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </Field>
                {/* Submit Button */}
                <Field>
                    <Button variant="default" type="submit" className="w-full">
                        Đặt lại mật khẩu
                    </Button>
                </Field>

                <FieldSeparator />
                <div className="text-center text-sm">
                    <div className="flex flex-row items-center justify-center gap-2 text-center">
                        <Link
                            to="/auth/login"
                            className="underline underline-offset-4"
                        >
                            Đăng nhập
                        </Link>
                        <FaArrowRight />
                    </div>
                </div>
            </FieldGroup>
        </form>
    );
}
