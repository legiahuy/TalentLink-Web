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
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'producer',
    });
    const [showPassword, setShowPassword] = useState(false);
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
                    <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Điền thông tin để tạo tài khoản mới
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

                <Field>
                    <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="role">Bạn là?</FieldLabel>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="producer">Nhà sản xuất</option>
                        <option value="singer">Ca sĩ</option>
                        <option value="venue">Địa điểm</option>
                    </select>
                </Field>

                {/* Password and Confirm Password - Two columns */}
                <div className="grid grid-cols-2 gap-3">
                    <Field>
                        <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
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
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                        </FieldLabel>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Xác nhận"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </Field>
                </div>

                {/* Submit Button */}
                <Field>
                    <Button variant="purple" type="submit" className="w-full">
                        Tạo tài khoản
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
                    Đã có tài khoản?{' '}
                    <Link
                        to="/auth/login"
                        className="underline underline-offset-4"
                    >
                        Đăng nhập
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
