import { Instagram, MessageCircle, Gamepad2, Send } from 'lucide-react';

export default function SocialPage() {
  const socials = [
    {
      name: 'Instagram',
      handle: '@enkountera',
      link: 'https://instagram.com/enkountera',
      icon: <Instagram className="w-6 h-6" />,
      color: 'bg-[#e1306c]',
      description: 'Follow us for latest updates and giveaways!'
    },
    {
      name: 'Discord',
      handle: 'Encounter',
      link: 'https://discord.gg/encounter',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'bg-[#5865f2]',
      description: 'Join our community to chat and get support.'
    },
    {
      name: 'WhatsApp',
      handle: '0812 2513 3501',
      link: 'https://wa.me/6281225133501',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-[#25d366]',
      description: 'Fast response for your orders and inquiries.'
    },
    {
      name: 'Telegram',
      handle: 'Coming Soon',
      link: '#',
      icon: <Send className="w-6 h-6" />,
      color: 'bg-[#0088cc]',
      description: 'Stay tuned for our official Telegram channel.',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Encounter Social Media</h1>
          <p className="text-slate-600">Bangun Koneksi Dengan Encounter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 ${social.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-green-500/30'}`}
              onClick={(e) => social.disabled && e.preventDefault()}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                  {social.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">{social.name}</h3>
                    {!social.disabled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600 uppercase tracking-wider">Active</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{social.handle}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{social.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
