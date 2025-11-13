export const svgs = import.meta.glob('./*.svg', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>
export const IconProps = {
  name: String,
  color: String,
  size: [String, Number]
}

export const getIcon = (name?: string) => {
  if (!name) return ''
  return svgs[`./${name}.svg`]
}
