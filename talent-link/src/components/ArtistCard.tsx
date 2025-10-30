import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

interface ArtistCardProps {
  id: string;
  name: string;
  image: string;
  genre: string;
  location: string;
  rating?: number;
  description?: string;
}

const ArtistCard = ({ id, name, image, genre, location, rating, description }: ArtistCardProps) => {
  return (
    <Link to={`/artist/${id}`} className="group block">
      <div className="relative flex flex-col h-[370px] w-[230px] rounded-2xl border border-primary/30 bg-card/70 shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow group-hover:border-primary/60">
        <div className="h-[60%] w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between bg-white/30 backdrop-blur-md backdrop-saturate-150 rounded-b-2xl border-t border-white/30 px-4 py-3 gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {/* Badge check (tuỳ chỉnh ở đây nếu có icon verified) */}
            {/* <Badge variant="success"><CheckIcon /></Badge> */}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            {rating !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-300 text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>
            )}
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-400 to-pink-400 text-white ml-2 px-3 py-1 rounded-full text-xs shadow-md">
              {genre}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;
