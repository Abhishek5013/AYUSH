type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="p-4 md:p-6 border-b bg-card">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-foreground font-headline md:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </header>
  );
}
