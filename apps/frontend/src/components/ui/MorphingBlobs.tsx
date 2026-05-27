export default function MorphingBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="animate-morph absolute -right-24 -top-36 h-[500px] w-[500px]"
        style={{ background: 'rgba(139,92,246,0.20)', filter: 'blur(80px)' }}
      />
      <div
        className="animate-morph absolute -bottom-20 -left-16 h-[350px] w-[350px]"
        style={{
          background: 'rgba(109,40,217,0.15)',
          filter: 'blur(80px)',
          animationDelay: '-4s',
        }}
      />
    </div>
  )
}
