import { useEffect, useState } from "react"

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setIsError(null)

    const controller = new AbortController()

    fetch(url, { signal: controller.signal, ...options })
      .then((res) => {
        if (!res.ok) {
          throw new Error("could not fetch the data for that resource")
        } else {
          return res.json()
        }
      })
      .then(setData)
      .catch((err) => {
        if (err?.name === "AbortError") return

        console.log(err)
        setIsError(err)
      })
      .finally(() => {
        if (controller.signal.aborted) return

        setIsLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [url])

  return { data, isLoading, isError }
}
