'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Link from 'next/link';
import { Mail, Key } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email deve ter um formato válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      
      toast.info('Funcionalidade em desenvolvimento');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao enviar email de recuperação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-[100px] h-[100px] rounded-full mb-3 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-[6px]">Smart Marketing</h1>
          <p className="text-base text-[#666]">Recuperar senha</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] z-10" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-11 h-14 bg-white border-[#e0e0e0] focus-visible:ring-[#FF4500] focus-visible:border-[#FF4500] rounded-xl"
              {...register('email')}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#d32f2f] ml-3 mb-3">{errors.email.message}</p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-14 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold text-base rounded-xl shadow-lg shadow-[#FF4500]/30"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Enviar email de recuperação
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
          <span className="text-sm text-[#999]">ou</span>
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
        </div>

        <p className="text-center text-sm text-[#666]">
          Lembrou sua senha?{' '}
          <Link href="/login" className="text-[#FF4500] font-bold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

