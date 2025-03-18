const slideViews = [
  {
    name: 'Irving penn: Centennial',
    photoPath: '/assets/irving-penn-centenial.jpg',
  },
  {
    name: 'The talks',
    photoPath: null,
  },
  {
    name: 'The bookstore',
    photoPath: null,
  },
];

export default async function LandingPage() {
  return (
    <section className='min-h-screen'>
      <div id='landing' className='mix-blend-difference pt-14'>
        <img src='/assets/mop.svg' alt='logo' className='h-[calc(100vh-7rem)]' />
      </div>
      {slideViews.map(slide => (
        <SlideView key={slide.name} {...slide} />
      ))}
    </section>
  );
}

function SlideView({ name, photoPath }: (typeof slideViews)[0]) {
  return (
    <div className='min-h-screen w-[54rem] bg-black flex items-center justify-center'>
      {photoPath ? (
        <img src={photoPath} alt={name} className='w-full h-full object-cover' />
      ) : (
        <h1 className='text-white text-4xl'>{name}</h1>
      )}
    </div>
  );
}
