import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Apartment {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hours, setHours] = useState(3);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();

  const apartments: Apartment[] = [
    {
      id: 1,
      title: 'Роскошные апартаменты в центре',
      price: 1500,
      rating: 4.9,
      reviews: 124,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/6e421476-f2b7-40e7-9b5b-abc5ab6c0a1e.jpg',
      location: 'Москва, Центр',
      amenities: ['Wi-Fi', 'Кухня', 'Кондиционер', 'Парковка'],
      bedrooms: 2,
      bathrooms: 2,
      area: 75
    },
    {
      id: 2,
      title: 'Стильная студия у метро',
      price: 800,
      rating: 4.7,
      reviews: 89,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/daaa14af-2116-4102-8a06-aef6bf285241.jpg',
      location: 'Москва, Сокол',
      amenities: ['Wi-Fi', 'Кухня', 'Телевизор'],
      bedrooms: 1,
      bathrooms: 1,
      area: 35
    },
    {
      id: 3,
      title: 'Пентхаус с панорамным видом',
      price: 3500,
      rating: 5.0,
      reviews: 67,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/b26f7af9-9841-48fb-a24e-0e15d055df89.jpg',
      location: 'Москва, Сити',
      amenities: ['Wi-Fi', 'Кухня', 'Кондиционер', 'Парковка', 'Джакузи', 'Терраса'],
      bedrooms: 3,
      bathrooms: 3,
      area: 120
    },
    {
      id: 4,
      title: 'Уютная квартира для двоих',
      price: 1200,
      rating: 4.8,
      reviews: 156,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/6e421476-f2b7-40e7-9b5b-abc5ab6c0a1e.jpg',
      location: 'Москва, Арбат',
      amenities: ['Wi-Fi', 'Кухня', 'Стиральная машина'],
      bedrooms: 1,
      bathrooms: 1,
      area: 45
    },
    {
      id: 5,
      title: 'Современная квартира у парка',
      price: 1800,
      rating: 4.9,
      reviews: 203,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/daaa14af-2116-4102-8a06-aef6bf285241.jpg',
      location: 'Москва, Парк Горького',
      amenities: ['Wi-Fi', 'Кухня', 'Кондиционер', 'Балкон'],
      bedrooms: 2,
      bathrooms: 1,
      area: 60
    },
    {
      id: 6,
      title: 'Семейные апартаменты',
      price: 2200,
      rating: 4.6,
      reviews: 92,
      image: 'https://cdn.poehali.dev/projects/bc2f7f3f-a1f8-4f23-839a-7f354885885e/files/b26f7af9-9841-48fb-a24e-0e15d055df89.jpg',
      location: 'Москва, Кутузовский',
      amenities: ['Wi-Fi', 'Кухня', 'Посудомойка', 'Парковка', 'Детская кроватка'],
      bedrooms: 3,
      bathrooms: 2,
      area: 90
    }
  ];

  const filteredApartments = apartments.filter(apt => 
    apt.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    apt.price >= priceRange[0] && apt.price <= priceRange[1]
  );

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    if (!selectedApartment) return 0;
    return selectedApartment.price * hours;
  };

  const handlePayment = async () => {
    if (!selectedApartment) return;
    
    if (!customerEmail) {
      toast({
        title: 'Ошибка',
        description: 'Укажите email для отправки подтверждения',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b3465267-cc05-41db-832f-e7be5e4acb1e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apartment_id: selectedApartment.id,
          apartment_title: selectedApartment.title,
          price: selectedApartment.price,
          hours: hours,
          total: calculateTotal(),
          customer_email: customerEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: '✅ Бронирование успешно!',
          description: data.test_mode 
            ? `Тестовый режим: ${data.message}` 
            : 'Платёж обработан. Детали отправлены на email.',
        });
        
        setSelectedApartment(null);
        setCustomerEmail('');
      } else {
        toast({
          title: 'Ошибка оплаты',
          description: data.error || 'Не удалось обработать платёж',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте интернет-соединение',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">
          <h1 className="text-6xl font-bold mb-4 animate-slide-up">
            Аренда квартир по часам
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Найдите идеальное место для встречи, работы или отдыха
          </p>
          
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Поиск квартиры..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <Input 
                type="number" 
                placeholder="Часов" 
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="h-12 text-lg"
              />
              <Button className="h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Icon name="Search" className="mr-2" />
                Найти
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Популярные предложения</h2>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Цена за час:</span>
            <span className="font-semibold">{priceRange[0]}₽ - {priceRange[1]}₽</span>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <Slider 
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={5000}
            step={100}
            className="mb-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.map((apt, index) => (
          <Card 
            key={apt.id} 
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-scale-in border-2 hover:border-primary"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedApartment(apt)}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={apt.image} 
                alt={apt.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(apt.id);
                }}
              >
                <Icon 
                  name="Heart" 
                  className={favorites.includes(apt.id) ? 'fill-red-500 text-red-500' : ''} 
                />
              </Button>
              <Badge className="absolute bottom-4 left-4 bg-accent text-white text-lg px-4 py-2">
                {apt.price}₽/час
              </Badge>
            </div>
            <CardContent className="p-6 space-y-3">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {apt.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="MapPin" size={16} />
                {apt.location}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{apt.rating}</span>
                  <span className="text-muted-foreground">({apt.reviews})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Icon name="Bed" size={16} />
                    {apt.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Bath" size={16} />
                    {apt.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Maximize" size={16} />
                    {apt.area}м²
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {apt.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {apt.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{apt.amenities.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => {
    const favoriteApartments = apartments.filter(apt => favorites.includes(apt.id));
    
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-4xl font-bold">Избранное</h2>
        {favoriteApartments.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Heart" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">Вы пока ничего не добавили в избранное</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteApartments.map((apt) => (
              <Card 
                key={apt.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                onClick={() => setSelectedApartment(apt)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={apt.image} 
                    alt={apt.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(apt.id);
                    }}
                  >
                    <Icon name="Heart" className="fill-red-500 text-red-500" />
                  </Button>
                  <Badge className="absolute bottom-4 left-4 bg-accent text-white text-lg px-4 py-2">
                    {apt.price}₽/час
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {apt.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={16} />
                    {apt.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-4xl font-bold">Профиль</h2>
      <Card className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
            ИИ
          </div>
          <div>
            <h3 className="text-2xl font-bold">Иван Иванов</h3>
            <p className="text-muted-foreground">ivan@example.com</p>
            <Badge className="mt-2 bg-primary text-white">Проверенный пользователь</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <Icon name="Clock" size={32} className="mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Бронирований</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <Icon name="Star" size={32} className="mx-auto mb-2 text-secondary" />
            <div className="text-3xl font-bold">4.9</div>
            <div className="text-sm text-muted-foreground">Рейтинг</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <Icon name="Heart" size={32} className="mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold">{favorites.length}</div>
            <div className="text-sm text-muted-foreground">В избранном</div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">История бронирований</h3>
          <div className="space-y-3">
            {[
              { title: 'Роскошные апартаменты в центре', date: '15 дек 2024', hours: 4, price: 6000 },
              { title: 'Стильная студия у метро', date: '10 дек 2024', hours: 2, price: 1600 },
              { title: 'Пентхаус с панорамным видом', date: '5 дек 2024', hours: 6, price: 21000 }
            ].map((booking, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{booking.title}</h4>
                    <p className="text-sm text-muted-foreground">{booking.date} • {booking.hours} часа</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{booking.price}₽</div>
                    <Badge variant="secondary">Завершено</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-4xl font-bold">Поддержка</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 hover:shadow-xl transition-shadow">
          <Icon name="MessageCircle" size={48} className="mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-2">Чат с поддержкой</h3>
          <p className="text-muted-foreground mb-4">
            Свяжитесь с нами в режиме реального времени
          </p>
          <Button className="w-full bg-gradient-to-r from-primary to-secondary">
            Открыть чат
          </Button>
        </Card>
        
        <Card className="p-8 hover:shadow-xl transition-shadow">
          <Icon name="Phone" size={48} className="mb-4 text-accent" />
          <h3 className="text-2xl font-bold mb-2">Телефон</h3>
          <p className="text-muted-foreground mb-4">
            +7 (495) 123-45-67
          </p>
          <Button variant="outline" className="w-full">
            Позвонить
          </Button>
        </Card>
      </div>

      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h3>
        <div className="space-y-4">
          {[
            { q: 'Как забронировать квартиру?', a: 'Выберите квартиру, укажите время и оплатите бронь.' },
            { q: 'Можно ли отменить бронирование?', a: 'Да, за 24 часа до заезда без штрафа.' },
            { q: 'Какие способы оплаты доступны?', a: 'Карты, СБП, электронные кошельки.' },
            { q: 'Как получить ключи?', a: 'Инструкции придут на email после оплаты.' }
          ].map((faq, index) => (
            <Card key={index} className="p-4 hover:border-primary transition-colors">
              <h4 className="font-semibold mb-2">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Home" className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HourlyRent
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'search', label: 'Поиск', icon: 'Search' },
                { id: 'favorites', label: 'Избранное', icon: 'Heart' },
                { id: 'profile', label: 'Профиль', icon: 'User' },
                { id: 'support', label: 'Поддержка', icon: 'Headphones' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon as any} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <Button className="md:hidden" variant="ghost" size="icon">
              <Icon name="Menu" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'search' && renderHome()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'support' && renderSupport()}
      </main>

      <Dialog open={!!selectedApartment} onOpenChange={() => setSelectedApartment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApartment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">{selectedApartment.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <img 
                  src={selectedApartment.image} 
                  alt={selectedApartment.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" className="text-primary" />
                    <span className="text-lg">{selectedApartment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Star" className="fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{selectedApartment.rating}</span>
                    <span className="text-muted-foreground">({selectedApartment.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Icon name="Bed" size={24} className="mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{selectedApartment.bedrooms} спальни</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Icon name="Bath" size={24} className="mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{selectedApartment.bathrooms} ванные</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Icon name="Maximize" size={24} className="mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{selectedApartment.area} м²</div>
                  </Card>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Удобства</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApartment.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-sm px-4 py-2">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <h3 className="text-xl font-bold mb-4">Калькулятор стоимости</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Количество часов</label>
                      <Slider 
                        value={[hours]}
                        onValueChange={(val) => setHours(val[0])}
                        min={1}
                        max={24}
                        step={1}
                        className="mb-2"
                      />
                      <div className="text-center font-semibold text-lg">{hours} часов</div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Email для подтверждения</label>
                      <Input 
                        type="email"
                        placeholder="your@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-lg pt-4 border-t-2">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {calculateTotal()}₽
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Icon name="Loader2" className="mr-2 animate-spin" />
                          Обработка...
                        </>
                      ) : (
                        <>
                          <Icon name="CreditCard" className="mr-2" />
                          Оплатить {calculateTotal()}₽
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="bg-gradient-to-r from-primary via-secondary to-accent text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HourlyRent</h3>
              <p className="opacity-90">Аренда квартир по часам в вашем городе</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Компания</h4>
              <ul className="space-y-2 opacity-90">
                <li>О нас</li>
                <li>Карьера</li>
                <li>Блог</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Поддержка</h4>
              <ul className="space-y-2 opacity-90">
                <li>Помощь</li>
                <li>Контакты</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Контакты</h4>
              <ul className="space-y-2 opacity-90">
                <li>+7 (495) 123-45-67</li>
                <li>info@hourlyrent.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center opacity-75">
            © 2024 HourlyRent. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;