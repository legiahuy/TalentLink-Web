

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Music, Users, Shield } from "lucide-react";
import ArtistCard from "@/components/ArtistCard";
import EventCard from "@/components/EventCard";
import heroImage from "@/assets/hero-image-2.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const LandingPage = () => {
  const featuredArtists = [
    {
      id: "1",
      name: "Minh Anh",
      image: artist1,
      genre: "Pop/Ballad",
      location: "Hà Nội",
      rating: 4.9,
      description: "Ca sĩ với giọng hát trữ tình, chuyên về nhạc pop và ballad Việt",
    },
    {
      id: "2",
      name: "Tuấn Anh",
      image: artist2,
      genre: "Indie/Rock",
      location: "TP. Hồ Chí Minh",
      rating: 4.8,
      description: "Nghệ sĩ guitar indie với phong cách hiện đại và sáng tạo",
    },
    {
      id: "3",
      name: "DJ Minh",
      image: artist3,
      genre: "EDM/House",
      location: "TP. Hồ Chí Minh",
      rating: 4.9,
      description: "DJ chuyên nghiệp với kinh nghiệm biểu diễn tại các sự kiện lớn",
    },
    {
      id: "4",
      name: "Thu Hà",
      image: artist4,
      genre: "Classical/Acoustic",
      location: "Hà Nội",
      rating: 5.0,
      description: "Nghệ sĩ violin cổ điển với kỹ thuật tinh tế và cảm xúc sâu lắng",
    },
  ];

  const featuredEvents = [
    {
      id: "1",
      title: "Đêm Nhạc Acoustic",
      date: "2025-11-15",
      time: "20:00",
      status: "upcoming" as const,
      artists: ["Minh Anh", "Thu Hà"],
      image: artist1,
    },
    {
      id: "2",
      title: "EDM Night Party",
      date: "2025-11-20",
      time: "21:00",
      status: "upcoming" as const,
      artists: ["DJ Minh"],
      image: artist3,
    },
    {
      id: "3",
      title: "Indie Rock Live",
      date: "2025-11-25",
      time: "19:30",
      status: "upcoming" as const,
      artists: ["Tuấn Anh"],
      image: artist2,
    },
  ];
  return (
    <>


      {/* Hero Section */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_10%_3.9%),hsl(240_8%_8%))]" />
        <div
          className="absolute inset-0 opacity-100"
          style={{

            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="mx-auto relative z-10 px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl leading-tight font-bold mb-6 text-white">
            Tìm Kiếm Tài Năng Âm Nhạc
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            Kết nối với nghệ sĩ độc lập chuyên nghiệp cho dự án của bạn
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute z-1 left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tìm nghệ sĩ, thể loại, dịch vụ..."
                className="pl-10 bg-card/50 backdrop-blur border-border/40"
              />
            </div>
            <Button size="lg" variant="default" asChild>
              <Link to="/discovery">
                Khám phá <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <span>🎤 Ca sĩ</span>
            <span>🎸 Nhạc công</span>
            <span>🎹 Producer</span>
            <span>🎧 DJ</span>
            <span>✍️ Nhạc sĩ</span>
          </div> */}
        </div>
      </section>

      <div
        className="inset-0 z-0 "
        style={{
          background: `radial-gradient(125% 125% at 50% 10%, #fff 35%, #d5c5ff 75%, #7c3aed 100%)`
        }}
      >

        {/* Featured Artists */}
        <section className="py-20">
          <div className="mx-auto px-4x max-w-[1320px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nghệ Sĩ Nổi Bật</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Khám phá những tài năng xuất sắc được lựa chọn đặc biệt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} {...artist} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link to="/discovery">
                  Xem tất cả nghệ sĩ <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20">
          <div className="mx-auto px-4 max-w-[1320px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sự Kiện Sắp Diễn Ra</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Những đêm nhạc hấp dẫn đang chờ đón bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link to="/discovery">
                  Xem tất cả sự kiện <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto px-4 max-w-[1320px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại Sao Chọn TalentLink?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nền tảng kết nối chuyên nghiệp và hiệu quả nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Music className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Đa Dạng Thể Loại</h3>
              <p className="text-muted-foreground">
                Từ pop, rock, EDM đến acoustic và cổ điển - tất cả đều có tại đây
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kết Nối Dễ Dàng</h3>
              <p className="text-muted-foreground">
                Gửi yêu cầu hợp tác trực tiếp, không cần qua trung gian
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Chuyên Nghiệp</h3>
              <p className="text-muted-foreground">
                Hồ sơ được xác minh, portfolio chất lượng cao
              </p>
            </div>
          </div>
        </div>
      </section>




      <div
        className="inset-0 z-0"
        style={{
          backgroundImage: `
       linear-gradient(to right, #f0f0f0 1px, transparent 1px),
       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
       radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),     /* Left */
       radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent),  /* Right */
       radial-gradient(circle 600px at 50% 0px, #d5c5ff, transparent),     /* Top */
       radial-gradient(circle 600px at 50% 100%, #d5c5ff, transparent)     /* Bottom */
     `,
          backgroundSize: `
       96px 64px,    
       96px 64px,    
       100% 100%,    
       100% 100%,
       100% 100%,
       100% 100%
     `,
        }}
      >

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto px-4 max-w-[1320px]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Bạn Là Nghệ Sĩ?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Tạo hồ sơ chuyên nghiệp và tiếp cận hàng nghìn cơ hội hợp tác
              </p>
              <Button size="lg" className="bg-primary text-lg" asChild>
                <Link to="/auth/signup">
                  Tạo hồ sơ miễn phí <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );

};

export default LandingPage;
