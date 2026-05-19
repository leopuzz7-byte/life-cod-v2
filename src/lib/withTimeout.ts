// Утилита: оборачивает promise в таймаут.
// Если operation не завершится за `ms` миллисекунд — кидаем понятную ошибку.

export function withTimeout<T>(
  operation: Promise<T>,
  ms: number,
  label = "Запрос"
): Promise<T> {
  return Promise.race([
    operation,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} занял слишком много времени (>${Math.round(ms / 1000)}с). Проверьте подключение к интернету.`)),
        ms
      )
    ),
  ]);
}
