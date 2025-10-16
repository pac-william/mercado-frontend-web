'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import LoadingSpinner from '@/components/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email deve ter um formato válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar para a página anterior ou home
      const next = searchParams.get('next') || '/';
      router.push(next);
    } catch (error) {
      toast.error('Email ou senha inválidos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-12">
          <div className="w-28 h-28 rounded-full mb-4 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-2">Smart Marketing</h1>
          <p className="text-base text-[#666]">Bem-vindo de volta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] z-10" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-11 h-14 bg-white border-[#e0e0e0] focus-visible:ring-[#2E7D32] focus-visible:border-[#2E7D32] rounded-xl"
              {...register('email')}
              disabled={isSubmitting || loading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#d32f2f] ml-3 mb-3">{errors.email.message}</p>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] z-10" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="pl-11 pr-11 h-14 bg-white border-[#e0e0e0] focus-visible:ring-[#2E7D32] focus-visible:border-[#2E7D32] rounded-xl"
              {...register('password')}
              disabled={isSubmitting || loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-[#d32f2f] ml-3 mb-3">{errors.password.message}</p>
          )}

          <div className="flex justify-end mb-6">
            <Link href="/forgot-password" className="text-sm text-[#0891B2] font-semibold hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-bold text-base rounded-xl shadow-lg shadow-[#2E7D32]/30"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
          <span className="text-sm text-[#999]">ou</span>
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
        </div>

        <p className="text-center text-sm text-[#666]">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-[#2E7D32] font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
