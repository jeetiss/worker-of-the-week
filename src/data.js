import React, { createContext, useContext } from 'react'

const Cache = createContext(new Map())

export const useDataFrom = url => {
  let cache = useContext(Cache)
  if (cache.has(url)) return cache.get(url)

  let promise = window
    .fetch(url)
    .then(response => response.json())
    .then(data => cache.set(url, data))

  throw promise
}


export default ({ children }) => {
  const data = useDataFrom('./api/contributions')

  return children(data)
}
