'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import { createLead, LeadData } from '@/lib/api';

interface ContactFormProps {
  title?: string;
  empreendimentoId?: number;
  className?: string;
}

export default function ContactForm({
  title = 'Cadastre-se e saiba mais!',
  empreendimentoId,
  className = '',
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadData>();

  const onSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createLead({
        ...data,
        empreendimento: empreendimentoId,
        pagina_origem: typeof window !== 'undefined' ? window.location.pathname : '',
      });
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={`bg-white rounded-2xl p-8 shadow-lg ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl text-virtu-dark mb-2">Obrigado!</h3>
          <p className="text-gray-600">Em breve entraremos em contato.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-8 shadow-lg ${className}`}>
      <h3 className="font-display text-2xl text-virtu-dark mb-6">{title}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
          <input
            type="text"
            placeholder="Nome completo"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-virtu-gold ${errors.nome ? 'border-red-500' : 'border-gray-200'}`}
            {...register('nome', { required: 'Nome é obrigatório' })}
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
          <input
            type="email"
            placeholder="E-mail"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-virtu-gold ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            {...register('email', { required: 'E-mail é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' } })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
          <input
            type="tel"
            placeholder="Telefone com DDD"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-virtu-gold ${errors.telefone ? 'border-red-500' : 'border-gray-200'}`}
            {...register('telefone', { required: 'Telefone é obrigatório' })}
          />
          {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
        </div>
        {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Fale com um especialista
        </Button>
      </form>
    </div>
  );
}
