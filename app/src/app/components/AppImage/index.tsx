import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  height: number;
  width: number;
  className?: string;
};

export type AppImageProps = Props;
export default function AppImage(props: Props) {
  const { src, alt, height, width, className } = props;

  return (
    <Image
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={className}
    />
  );
}
