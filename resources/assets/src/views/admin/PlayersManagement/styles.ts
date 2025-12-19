import styled from '@emotion/styled'
import * as breakpoints from '@/styles/breakpoints'

export const Box = styled.div`
  width: 48%;
  margin: 0;

  ${breakpoints.lessThan(breakpoints.Breakpoint.lg)} {
    width: 98%;
  }
`
