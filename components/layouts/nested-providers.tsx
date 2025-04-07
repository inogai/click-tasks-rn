export interface NestedProvidersProps {
  providers: React.ComponentType<{ children: React.ReactNode }>[]
  children: React.ReactNode
}

export function NestedProviders({
  children,
  providers,
}: NestedProvidersProps) {
  if (providers.length === 0) {
    return children
  }

  const [Provider, ...rest] = providers

  return <Provider>{NestedProviders({ children, providers: rest })}</Provider>
}
