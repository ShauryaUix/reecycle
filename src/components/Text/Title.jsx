import styled from 'styled-components'



const Title = styled.h2`
  line-height: 1.2;
  color: ${({ theme, color, customColor }) =>
    customColor ? customColor : theme.colors.text[color || 'dark']};
  font-size: ${({ fontSize = 28 }) => fontSize}px;
  font-weight: ${({ fontWeight = 900 }) => fontWeight};
  opacity: ${({ opacity = 1 }) => opacity};
`

Title.defaultProps = {
  color: 'dark',
  customColor: '',
  fontWeight: 900,
  fontSize: 28,
  opacity: 1,
}

export default Title
