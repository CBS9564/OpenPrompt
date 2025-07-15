import React, { useState } from 'react';
import { View, HomePageProps } from '../types';
import { BoltIcon } from './icons/BoltIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { ImageIcon } from './icons/ImageIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { DiscoverIcon } from './icons/DiscoverIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { GitHubIcon } from './icons/GitHubIcon';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, onClick: () => void }> = ({ icon, title, children, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="text-left bg-content p-6 rounded-lg border border-border transition-all duration-300 hover:border-accent/50 hover:bg-card hover:scale-105"
        >
            <div className="flex items-center gap-4 mb-3">
                <div className="bg-accent/10 p-2 rounded-lg text-accent">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-primary">{title}</h3>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
                {children}
            </p>
        </button>
    );
}

const HomePage: React.FC<HomePageProps> = ({ onViewChange, user, onNavigateToDetail, login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const result = await login('email', email, password);
      if (!result?.success) {
        alert(result?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  if (!user) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-background">
            <div className="text-center max-w-sm w-full">
                <h1 className="text-5xl font-bold text-accent tracking-tighter">OpenPrompt</h1>
                <p className="mt-4 text-lg text-secondary">
                    Welcome. Please sign in to continue.
                </p>
                 <form onSubmit={handleLogin} className="mt-8 text-left space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full pl-3 pr-3 py-3 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="password-mock" className="block text-sm font-medium text-secondary mb-2">Password</label>
                        <div className="relative">
                            <input
                                id="password-mock"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-3 pr-3 py-3 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-primary"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!email}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-transform hover:scale-105 shadow-lg disabled:bg-accent/50 disabled:cursor-not-allowed"
                    >
                        Sign In with Email
                    </button>
                    <p className="pt-1 text-xs text-secondary text-center">
                        Authentication is mocked. Any email will work.
                    </p>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-background px-2 text-secondary">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                     <button
                        type="button"
                        onClick={() => login('google')}
                        className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-card px-3 py-3 text-sm font-semibold leading-6 text-primary shadow-sm ring-1 ring-inset ring-border hover:bg-card-hover focus-visible:outline-offset-0"
                    >
                        <GoogleIcon className="h-5 w-5"/>
                        <span className="text-sm font-semibold leading-6">Sign in with Google</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => login('github')}
                        className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-card px-3 py-3 text-sm font-semibold leading-6 text-primary shadow-sm ring-1 ring-inset ring-border hover:bg-card-hover focus-visible:outline-offset-0"
                    >
                        <GitHubIcon className="h-5 w-5"/>
                        <span className="text-sm font-semibold leading-6">Sign in with GitHub (Mock)</span>
                    </button>
                </div>

            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1">
             <section className="relative text-center py-24 px-4 sm:px-6 lg:px-8 bg-grid-pattern overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter leading-tight">
                        The Ultimate Toolkit for <span className="text-accent">Prompt Engineering</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-secondary">
                        OpenPrompt is a community-driven platform to create, share, and test prompts and AI agents. Explore a library of curated prompts, configure agents, and experiment in a real-time, multimodal playground.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => onViewChange(View.PROMPTS)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-transform hover:scale-105 shadow-lg"
                        >
                           <DiscoverIcon className="w-5 h-5" />
                           Explore Community Prompts
                        </button>
                        <button
                             onClick={() => onViewChange(View.CREATE)}
                            className="w-full sm:w-auto px-6 py-3 bg-card border border-border text-primary font-semibold rounded-lg hover:bg-card-hover transition-transform hover:scale-105"
                        >
                            Create Your First Prompt
                        </button>
                    </div>
                </div>
            </section>

             <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-primary tracking-tight">Powerful Features, Simple Interface</h2>
                        <p className="mt-4 text-lg text-secondary">Everything you need to master your AI interactions.</p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <FeatureCard icon={<BoltIcon className="w-6 h-6"/>} title="Unified Playground" onClick={() => onNavigateToDetail('prompt-001', 'prompt')}>
                            Test prompts, agents, and personas against multiple LLM providers like Gemini and Ollama in a single, intuitive chat interface.
                        </FeatureCard>
                        <FeatureCard icon={<ImageIcon className="w-6 h-6"/>} title="Multimodal Inputs" onClick={() => onNavigateToDetail('p_cook_helper', 'prompt')}>
                            Go beyond text. Attach images for vision-based tasks or use your voice for fast and easy dictation.
                        </FeatureCard>
                         <FeatureCard icon={<UsersIcon className="w-6 h-6"/>} title="Community & Private Library" onClick={() => onViewChange(user ? View.MY_PROMPTS : View.PROMPTS)}>
                            Share your creations with the world or keep them in your private, persistent library. You have full control over your content's visibility.
                        </FeatureCard>
                        <FeatureCard icon={<PencilIcon className="w-6 h-6"/>} title="Full Edit & Detail Views" onClick={() => onNavigateToDetail('a1', 'agent')}>
                            A complete management experience. Click any item to see a full-page detail view, test it, and edit it in place if you're the author.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon className="w-6 h-6"/>} title="AI-Assisted Creation" onClick={() => onViewChange(View.CREATE)}>
                            Stuck for ideas? Generate high-quality prompt templates or system instructions from a simple title and description, powered by AI.
                        </FeatureCard>
                         <FeatureCard icon={<DatabaseIcon className="w-6 h-6"/>} title="Local-First Database" onClick={() => onViewChange(View.CONTEXTS)}>
                           Your data is yours. All prompts and agents are stored in a robust SQLite database that lives entirely within your browser.
                        </FeatureCard>
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
};

export default HomePage;