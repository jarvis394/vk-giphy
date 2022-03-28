import React from 'react'

export const formatNewLine = (s: string) => {
  const splittedString = s.split('\n')
  return (
    <>
      {splittedString.map((e, i) => (
        <>
          {e.trim() === '' ? <>&nbsp;</> : e}
          {splittedString.length > 1 && i !== splittedString.length - 1 && (
            <br />
          )}
        </>
      ))}
    </>
  )
}
