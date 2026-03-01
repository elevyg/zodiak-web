import Image from "next/image"

export function StorySection() {
  return (
    <section className="bg-white flex flex-col">
      <div className="relative h-[400px] w-screen overflow-hidden bg-white">
        <Image
          src="/images/galeria-01.jpg"
          alt="Top Les Vans en entorno de montaña"
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="bg-white text-base leading-relaxed text-inkMuted md:text-lg p-12 md:p-16 flex flex-col gap-4">
        <p>
          Por eso tratamos de diseñar un Top perfecto para que te sientas
          cómoda, hagas lo que hagas.
        </p>
        <p>
          Muy versátil para cualquier aventura al aire libre, puedes usarlo
          durante semanas mientras caminas por las montañas, escalas,
          corres,esquiás, haces yoga o te tiras a un lago. Rompiendo con el
          diseño clasico de la ropa deportiva, nuestros tops están diseñados
          para adaptarse a las mujeres modernas ... Sin costuras molestas,
          reversibles y extremadamente comodos.
        </p>
        <p>
          Nuestro Top "Les Vans" es el compañero perfecto para cualquier
          aventura. Tenemos una variedad enorme de colores. Todos nuestros Tops
          son de edición limitada.
        </p>
      </div>
    </section>
  )
}
