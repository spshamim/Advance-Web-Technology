export default function ContactLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
      <h1>About Layout</h1>
   
        {children}
      </section>
    )
  }