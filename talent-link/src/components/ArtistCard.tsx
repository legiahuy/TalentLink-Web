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

const ArtistCard = ({ id, name, image, genre, location, rating, description, glassy, animated }: ArtistCardProps & { glassy?: boolean; animated?: boolean }) => {
  return (
    <Link to={`/artist/${id}`} className={`group block ${animated ? 'animate-in fade-in zoom-in duration-500' : ''}`}>
      <div className={`relative overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-300 ${glassy ? 'bg-card/80 shadow-lg backdrop-blur border-primary/40' : ''} group-hover:shadow-glow group-hover:scale-105 group-hover:border-primary/60`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-card">
              {genre}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;
