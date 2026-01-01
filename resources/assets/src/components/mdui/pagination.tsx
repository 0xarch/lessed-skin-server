import React from 'react'

interface Props {
  page: number
  totalPages: number
  onChange(page: number): void | Promise<void>
}

const Pagination: React.FC<Props> = (props) => {
  const { page, totalPages, onChange } = props

  if (totalPages < 1) {
    return null
  }

  return (
    <ul
      className="md-pagination"
      style={{ marginLeft: 'auto', marginTop: '1rem', width: 'fit-content' }}
    >
      <mdui-button-icon
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        icon="navigate_before"
      />
      {totalPages < 8 ? (
        Array.from({ length: totalPages }).map((_, i) => (
          <mdui-button-icon
            key={i}
            variant={page === i + 1 ? 'filled' : 'standard'}
            onClick={() => onChange(i + 1)}
          >
            <span style={{ fontSize: 'medium' }}>{i + 1}</span>
          </mdui-button-icon>
        ))
      ) : (
        <>
          {page < 4 ? (
            [1, 2, 3, 4].map((n) => (
              <mdui-button-icon
                key={n}
                variant={page === n ? 'filled' : 'standard'}
                onClick={() => onChange(n)}
              >
                <span style={{ fontSize: 'medium' }}>{n}</span>
              </mdui-button-icon>
            ))
          ) : (
            <mdui-button-icon variant="standard" onClick={() => onChange(1)}>
              <span style={{ fontSize: 'medium' }}>1</span>
            </mdui-button-icon>
          )}
          <mdui-button className="d-none" disabled variant="text">
            ...
          </mdui-button>
          {page > 3 && page < totalPages - 2 && (
            <>
              {[page - 1, page, page + 1].map((n) => (
                <mdui-button-icon
                  key={n}
                  variant={page === n ? 'filled' : 'standard'}
                  onClick={() => onChange(n)}
                >
                  <span style={{ fontSize: 'medium' }}>{n}</span>
                </mdui-button-icon>
              ))}
              <mdui-button className="d-none" disabled variant="text">
                ...
              </mdui-button>
            </>
          )}
          {totalPages - page < 3 ? (
            [totalPages - 3, totalPages - 2, totalPages - 1, totalPages].map(
              (n) => (
                <mdui-button-icon
                  key={n}
                  variant={page === n ? 'filled' : 'standard'}
                  onClick={() => onChange(n)}
                >
                  <span style={{ fontSize: 'medium' }}>{n}</span>
                </mdui-button-icon>
              ),
            )
          ) : (
            <mdui-button-icon
              variant="standard"
              onClick={() => onChange(totalPages)}
            >
              <span style={{ fontSize: 'medium' }}>{totalPages}</span>
            </mdui-button-icon>
          )}
        </>
      )}
      <mdui-button-icon
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        icon="navigate_next"
      />
    </ul>
  )
}

export default Pagination
