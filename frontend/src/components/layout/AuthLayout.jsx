function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                    TM
                </div>
                <h1 className="text-2xl font-bold tracking-tight">TalentMind AI</h1>
                <p className="text-muted-foreground text-sm mt-1">Your Personal AI Career Coach</p>
            </div>
            {children}
        </div>
      </div>
    );
}

export default AuthLayout;
