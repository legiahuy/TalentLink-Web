import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });
            navigate('/user/dashboard');
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : 'Đăng nhập thất bại';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className={cn('flex flex-col gap-3', className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="mb-3 flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Đăng nhập</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Nhập email của bạn để đăng nhập
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

                {/* Password */}
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                        <Link
                            to="/auth/forgot-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            aria-label={
                                showPassword
                                    ? 'Ẩn mật khẩu'
                                    : 'Hiển thị mật khẩu'
                            }
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </Field>

                {/* Error Message */}
                {error && (
                    <Field>
                        <div className="text-center text-sm text-red-500">
                            {error}
                        </div>
                    </Field>
                )}

                {/* Submit Button */}
                <Field>
                    <Button
                        variant="purple"
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </Button>
                </Field>

                <FieldSeparator>Hoặc tiếp tục với</FieldSeparator>

                <Field>
                    <Button variant="outline" type="button" className="w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                        </svg>
                        Đăng nhập bằng Google
                    </Button>
                </Field>

                <FieldDescription className="text-center text-sm">
                    Chưa có tài khoản?{' '}
                    <Link
                        to="/auth/signup"
                        className="underline underline-offset-4"
                    >
                        Đăng ký ngay
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
