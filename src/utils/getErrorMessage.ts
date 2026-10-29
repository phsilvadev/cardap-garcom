export function getErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/user-disabled': 'Seu acesso foi desativado. Fale com o restaurante.',
    'auth/too-many-requests':
      'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed':
      'Sem conexão. Confira sua internet e tente novamente.',
    'functions/permission-denied':
      'Seu acesso de garçom não está ativo. Fale com o restaurante.',
    'functions/not-found':
      'O acesso ao app ainda não foi liberado. Fale com o restaurante.',
    'functions/unauthenticated': 'Sua sessão expirou. Entre novamente.',
    'functions/unavailable':
      'Não foi possível conectar. Tente novamente em instantes.',
    'functions/deadline-exceeded':
      'A conexão demorou mais que o esperado. Tente novamente.',
  };
  return (
    (code && messages[code]) ||
    'Não foi possível concluir. Tente novamente ou fale com o restaurante.'
  );
}
