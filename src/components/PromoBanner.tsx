export const PromoBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary/90 to-primary rounded-2xl p-5 overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10">
        <h3 className="text-primary-foreground font-bold text-xl mb-1">Diskon 17%</h3>
        <p className="text-primary-foreground/80 text-sm">
          Buat Kamu yang Punya Nama Bertema Kemerdekaan!
        </p>
      </div>
    </div>
  );
};
