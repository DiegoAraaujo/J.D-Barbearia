import * as React from "react"
import { Star, UserRound } from "lucide-react"
import { cn } from "@/utils/class-name"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  role: string
  testimonial?: string
  rating?: number
  image?: string
  avatarClassName?: string
}

const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  ({ name, role, testimonial, rating = 5, image, avatarClassName, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-bone/10 bg-surface p-6 transition-colors hover:border-gold/30 md:p-7",
          className,
        )}
        {...props}
      >
        {testimonial ? (
          <span className="absolute right-6 top-5 font-display text-6xl leading-none text-wine-bright/25 md:right-7 md:top-6">&ldquo;</span>
        ) : null}

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              className={
                index < rating ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-bone/20"
              }
            />
          ))}
        </div>

        {testimonial ? <p className="text-pretty text-sm leading-relaxed text-bone/80 md:text-base">{testimonial}</p> : null}

        <div className="mt-auto flex items-center gap-3">
          <Avatar className={avatarClassName}>
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback className="bg-bone/10 text-bone/60">
              <UserRound className="h-1/2 w-1/2" aria-hidden="true" />
              <span className="sr-only">Avatar padrão de {name}</span>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-bone">{name}</span>
            <span className="text-xs text-bone/60">{role}</span>
          </div>
        </div>
      </div>
    )
  },
)
Testimonial.displayName = "Testimonial"

export { Testimonial }
