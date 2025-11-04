'use client';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Music, Mail, ExternalLink, MoreHorizontal, UserPen } from "lucide-react";
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Plus } from "lucide-react";  // Icon "+" từ lucide-react


const ArtistProfile = () => {
  const services = [
    { name: "Biểu diễn tại sự kiện", price: "Liên hệ" },
    { name: "Thu âm vocal", price: "500.000đ/bài" },
    { name: "Sáng tác ca khúc", price: "Liên hệ" },
    { name: "Dạy thanh nhạc", price: "300.000đ/buổi" },
  ];

  const portfolio = [
    {
      title: "Nơi Này Có Anh",
      type: "Cover",
      embed: "https://www.youtube.com/embed/x0QfBGW2y2E",
    },
    {
      title: "Lạc Trôi",
      type: "Cover",
      embed: "https://www.youtube.com/embed/DrY_K0mT-As",
    },
    {
      title: "Lạc Trôi",
      type: "Cover",
      embed: "https://www.youtube.com/embed/DrY_K0mT-As",
    },
  ];

  const trackList = [
    { id: 1, title: "Hôm nay tôi buồn", artist: "Phùng Khánh Linh, ft Sơn Tùng", date: "Jul 27, 2025", length: "3.25", },
    { id: 2, title: "Hôm nay tôi buồn", artist: "Phùng Khánh Linh, ft Sơn Tùng", date: "Jul 27, 2025", length: "3.25", },
    { id: 3, title: "Hôm nay tôi buồn", artist: "Phùng Khánh Linh, ft Sơn Tùng", date: "Jul 27, 2025", length: "3.25", },
  ];

  // Event data cho các sự kiện nghệ sĩ
  const eventData = [
    {
      id: '1',
      title: 'Đêm Nhạc Acoustic - Những Bản Tình Ca',
      date: '2025-11-15',
      time: '20:00',
      status: 'upcoming' as const,
      artists: ['Minh Anh', 'Thu Hà'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '2',
      title: 'Sự kiện âm nhạc ngoài trời',
      date: '2025-12-10',
      time: '19:00',
      status: 'ongoing' as const,
      artists: ['Minh Anh', 'Lê Hoàng'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '3',
      title: 'Lễ hội âm nhạc quốc tế',
      date: '2025-10-30',
      time: '21:00',
      status: 'past' as const,
      artists: ['Minh Anh', 'Duy Khang'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ];

  // Hàm xử lý sự kiện khi nhấn vào nút "+"
  const handleAddPortfolio = () => {
    alert("Thêm video vào Portfolio");
  };

  const handleAddTrack = () => {
    alert("Thêm bài hát vào danh sách");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Cover Image */}
        <div className="h-64 md:h-80 bg-gradient-dark relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(/images/profile/artist-1.jpg)`, // Customize the image here
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="px-6 md:px-8">
          <div className="mx-auto max-w-screen-xl">
            <div className="relative -mt-24 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative md:order-1">
                  <img
                    src="/images/profile/artist-1.jpg"  
                    alt="Minh Anh"
                    className="w-48 h-48 rounded-2xl object-cover border-4 border-background shadow-glow"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-primary rounded-full p-3">
                    <Music className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                <div className="md:ml-auto md:order-3">
                  <Button 
                    size="lg" 
                    className="bg-primary text-white hover:opacity-90 transition-opacity"
                    asChild
                  >
                    <Link 
                      href="/a"
                      className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                    >
                      <UserPen className="mr-2 h-5 w-5" />
                      Thay đổi thông tin
                    </Link>
                  </Button>
                </div>

                <div className="flex-1 pt-0 md:order-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-start flex-wrap gap-4 md:gap-6 mb-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">Minh Anh</h1>
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-semibold">4.9</span>
                          <span>(28 đánh giá)</span>
                        </div>
                      </div>
                    </div>

                    {/* Button moved to outer row for perfect vertical centering with avatar */}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary">Pop</Badge>
                    <Badge className="bg-primary">Ballad</Badge>
                    <Badge className="bg-primary">R&B</Badge>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Ca sĩ với hơn 5 năm kinh nghiệm trong ngành âm nhạc. Chuyên về dòng nhạc pop và ballad Việt Nam. 
                    Đã từng biểu diễn tại nhiều sự kiện lớn và có đam mê mang đến những trải nghiệm âm nhạc đầy cảm xúc.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Portfolio */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.map((item, index) => (
                      <Card key={index} className="overflow-hidden bg-card border-border/40">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={item.embed}
                            title={item.title}
                            frameBorder="0"
                            allow="accelearometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Add tile centered */}
                    <div className="aspect-video flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10">
                      <Button
                        onClick={handleAddPortfolio}
                        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      >
                        <Plus className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Track List trong Card */}
                <section>
                  <Card className="overflow-hidden bg-card border-border/40">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {trackList.map((track) => (
                          <div key={track.id} className="flex justify-between items-center p-4 border-b border-border/40">
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-xl">{track.id}</span>
                              <img src="/images/profile/artist-1.jpg" alt="Track" className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                <h3 className="font-semibold">{track.title}</h3>
                                <p className="text-sm text-muted-foreground">{track.artist}</p>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">{track.date}</div>
                            <div className="text-sm text-muted-foreground">{track.length} min</div>
                            <div className="text-muted-foreground cursor-pointer">
                              <MoreHorizontal className="h-5 w-5" />
                            </div>
                          </div>
                        ))}

                        {/* Nút "+" để thêm bài hát */}
                        <div className="w-full flex justify-center">
                          <Button
                            onClick={handleAddTrack}
                            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity mx-auto"
                            size="lg"
                          >
                            <Plus className="h-5 w-5" /> {/* Biểu tượng "+" */}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
                
                {/* About */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
                  <Card className="bg-card border-border/40">
                    <CardContent className="p-6">
                      <div className="space-y-4 text-muted-foreground">
                        <p>
                          Xin chào! Tôi là Minh Anh, một ca sĩ đam mê với dòng nhạc pop và ballad Việt Nam. 
                          Với giọng hát trữ tình và khả năng diễn đạt cảm xúc sâu sắc, tôi luôn mong muốn mang đến 
                          những trải nghiệm âm nhạc đáng nhớ cho khán giả.
                        </p>
                        <p>
                          Tôi có kinh nghiệm biểu diễn tại các sự kiện như đám cưới, tiệc công ty, và các buổi 
                          hòa nhạc nhỏ. Ngoài ra, tôi cũng có thể hỗ trợ thu âm vocal và dạy thanh nhạc cho những 
                          bạn muốn phát triển kỹ năng ca hát.
                        </p>
                        <p>
                          Hãy liên hệ với tôi để thảo luận về dự án của bạn. Tôi rất mong được hợp tác!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Services */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Dịch vụ</h2>
                  <Card className="bg-card border-border/40">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {services.map((service, index) => (
                          <div key={index} className="flex justify-between items-start pb-4 border-b border-border/40 last:border-0 last:pb-0">
                            <div className="flex-1">
                              <h3 className="font-medium">{service.name}</h3>
                            </div>
                            <div className="text-primary font-semibold whitespace-nowrap ml-4">
                              {service.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Contact Info */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Liên kết</h2>
                  <Card className="bg-card border-border/40">
                    <CardContent className="p-6 space-y-3">
                      <a 
                        href="https://youtube.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>YouTube Channel</span>
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Instagram</span>
                      </a>
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Facebook Page</span>
                      </a>
                    </CardContent>
                  </Card>
                </section>

                {/* Ảnh Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Ảnh</h2>
                  <Card className="bg-card border-border/40">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Các ảnh trong lưới */}
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 1" className="w-full h-full object-cover rounded-lg" />
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 2" className="w-full h-full object-cover rounded-lg" />
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 3" className="w-full h-full object-cover rounded-lg" />
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 4" className="w-full h-full object-cover rounded-lg" />
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 5" className="w-full h-full object-cover rounded-lg" />
                        <img src="/images/profile/artist-1.jpg" alt="Billie Eilish 6" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      {/* Nút "Hiện tất cả" */}
                      <div className="w-full flex justify-center mt-4">
                        <Link href="/photos" className="text-gray-400 hover:text-primary text-lg font-semibold text-shadow-stack">
                          Hiện tất cả
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </section>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArtistProfile;
