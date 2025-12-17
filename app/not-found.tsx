export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
        <p className="mt-2 text-sm text-muted-foreground">The page you’re looking for doesn’t exist or has been moved.</p>
        <a href="/" className="inline-block mt-6 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Back to Home</a>
      </div>
    </div>
  )
}


