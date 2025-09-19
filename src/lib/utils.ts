import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, '');
  
  // Verifica o formato com base na quantidade de dígitos
  if (digits.length === 11) {
    // Formato: (XX) XXXXX-XXXX (celular)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    // Formato: (XX) XXXX-XXXX (fixo)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 8) {
    // Formato: XXXX-XXXX (fixo sem DDD)
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else if (digits.length === 9) {
    // Formato: XXXXX-XXXX (celular sem DDD)
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  
  // Retorna o valor original se não corresponder a nenhum formato reconhecido
  return phone;
}
