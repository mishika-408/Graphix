import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Link, useLocation } from 'wouter';
import Grapher2D from '@/pages/Grapher2D';
import Grapher3D from '@/pages/Grapher3D';
import Solver from '@/pages/Solver';
import { BarChart3, Box, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-border">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold glow-text text-primary">Graphix</h1>
          </div>
          <nav className="flex gap-2">
            {[
              { href: '/', label: '2D', icon: BarChart3, activeColor: 'bg-primary text-primary-foreground', testId: 'nav-2d-grapher' },
              { href: '/3d', label: '3D', icon: Box, activeColor: 'bg-secondary text-secondary-foreground', testId: 'nav-3d-grapher' },
              { href: '/solver', label: 'Solver', icon: Calculator, activeColor: 'bg-accent text-accent-foreground', testId: 'nav-solver' },
            ].map(({ href, label, icon: Icon, activeColor, testId }) => (
              <Link key={href} href={href}>
                <button
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium',
                    location === href ? activeColor : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                  data-testid={testId}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Switch>
          <Route path="/" component={Grapher2D} />
          <Route path="/3d" component={Grapher3D} />
          <Route path="/solver" component={Solver} />
          <Route>
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Page not found</h2>
                <Link href="/">
                  <button className="text-primary hover:underline">
                    Go to 2D Grapher
                  </button>
                </Link>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
