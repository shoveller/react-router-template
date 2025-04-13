import * as React from 'react'
import useEmblaCarousel, {
  type UseEmblaCarouselType
} from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

// 유틸리티 함수들
const getAxisFromOrientation = (orientation: 'horizontal' | 'vertical') => {
  if (orientation === 'horizontal') {
    return 'x' as const
  }

  return 'y' as const
}

const getOrientationFromAxis = (
  orientation: 'horizontal' | 'vertical',
  axis?: string
) => {
  if (orientation) {
    return orientation
  }

  if (axis === 'y') {
    return 'vertical' as const
  }

  return 'horizontal' as const
}

const getOrientationStyles = (
  orientation: 'horizontal' | 'vertical',
  styles: { horizontal: string; vertical: string }
) => {
  if (orientation === 'horizontal') {
    return styles.horizontal
  }

  return styles.vertical
}

const onSelectHandler = (
  carouselApi: CarouselApi,
  setCanScrollPrev: React.Dispatch<React.SetStateAction<boolean>>,
  setCanScrollNext: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!carouselApi) {
    return
  }

  setCanScrollPrev(carouselApi.canScrollPrev())
  setCanScrollNext(carouselApi.canScrollNext())
}

const handleKeyboardEvent = (
  e: React.KeyboardEvent<HTMLDivElement>,
  scrollPrev: () => void,
  scrollNext: () => void
) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    scrollPrev()

    return
  }

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    scrollNext()
  }
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const emblaOptions = {
      ...opts,
      axis: getAxisFromOrientation(orientation)
    }

    const [carouselRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback(() => {
      onSelectHandler(emblaApi, setCanScrollPrev, setCanScrollNext)
    }, [emblaApi])

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext()
    }, [emblaApi])

    const handleKeyDown = React.useCallback(
      (evt: React.KeyboardEvent<HTMLDivElement>) => {
        handleKeyboardEvent(evt, scrollPrev, scrollNext)
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!emblaApi || !setApi) {
        return
      }

      setApi(emblaApi)
    }, [emblaApi, setApi])

    React.useEffect(() => {
      if (!emblaApi) {
        return
      }

      onSelect()
      emblaApi.on('reInit', onSelect)
      emblaApi.on('select', onSelect)

      return () => {
        emblaApi?.off('select', onSelect)
      }
    }, [emblaApi, onSelect])

    const finalOrientation = getOrientationFromAxis(orientation, opts?.axis)

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: emblaApi,
          opts,
          orientation: finalOrientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation = 'horizontal' } = useCarousel()

  const contentStyles = getOrientationStyles(orientation, {
    horizontal: '-ml-4',
    vertical: '-mt-4 flex-col'
  })

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn('flex', contentStyles, className)}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation = 'horizontal' } = useCarousel()

  const itemStyles = getOrientationStyles(orientation, {
    horizontal: 'pl-4',
    vertical: 'pt-4'
  })

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        itemStyles,
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const {
    orientation = 'horizontal',
    scrollPrev,
    canScrollPrev
  } = useCarousel()

  const buttonStyles = getOrientationStyles(orientation, {
    horizontal: '-left-12 top-1/2 -translate-y-1/2',
    vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90'
  })

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('absolute h-8 w-8 rounded-full', buttonStyles, className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const {
    orientation = 'horizontal',
    scrollNext,
    canScrollNext
  } = useCarousel()

  const buttonStyles = getOrientationStyles(orientation, {
    horizontal: '-right-12 top-1/2 -translate-y-1/2',
    vertical: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90'
  })

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn('absolute h-8 w-8 rounded-full', buttonStyles, className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
}
