import styled from 'styled-components'


const Paragraph = styled.p`
  line-height: 1.25;
  color: ${({ theme, color, customColor }) =>
    customColor ? customColor : theme.colors.text[color || 'dark']};
  font-size: ${({ fontSize = 14 }) => fontSize}px;
  font-weight: ${({ fontWeight = 500 }) => fontWeight};
  opacity: ${({ opacity = 1 }) => opacity};
  white-space: pre-wrap;
`

Paragraph.defaultProps = {
  color: 'dark',
  customColor: '',
  fontWeight: 500,
  fontSize: 14,
  opacity: 1,
}

export default Paragraph
