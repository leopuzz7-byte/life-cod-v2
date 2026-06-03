// Генерация 22 арканов Таро через OpenAI DALL-E 3
// Запуск: node generate-arcana.mjs

import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.env.OPENAI_API_KEY || 'sk-R9EbahApL9VQWtzJJuH1fI95v8fleV6q';
const OUTPUT_DIR = './src/assets/arcana';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Базовый стиль — одинаковый для всех карт
const STYLE = `Premium tarot card illustration, modern fantasy painterly style,
highly detailed digital art, dramatic cinematic lighting, rich deep colors,
gold ornamental decorative border frame around card edges,
Roman numeral at the top center, elegant gold banner with the card name at the bottom,
portrait orientation. Style: dramatic fantasy illustration like modern book covers,
similar to a high-quality premium tarot deck with dark moody atmosphere and golden accents.
DO NOT include any text except the card name and Roman numeral.`;

// 22 аркана с конкретными описаниями
const ARCANA = [
  {
    num: 1, roman: 'I', name: 'The Magician',
    desc: 'A young powerful male magician standing confidently at a table with magical tools: wand, chalice, sword, and pentacle. His right hand raises a wand toward the sky, left hand points to the earth. An infinity symbol floats above his head. Surrounded by red roses and white lilies. Mystical energy swirling around him.'
  },
  {
    num: 2, roman: 'II', name: 'The High Priestess',
    desc: 'A serene mysterious woman in flowing blue and white robes, seated on a throne between two pillars (one black, one white). A crescent moon at her feet, a veil of pomegranates behind her. She holds a scroll with sacred knowledge. Ethereal moonlight atmosphere, deep wisdom in her eyes.'
  },
  {
    num: 3, roman: 'III', name: 'The Empress',
    desc: 'A beautiful radiant woman seated on a luxurious throne in a lush forest, wearing a crown of twelve stars, a robe decorated with pomegranates. Surrounded by golden wheat fields, tall trees, a waterfall nearby. She radiates abundance, fertility, and natural beauty. Warm golden light.'
  },
  {
    num: 4, roman: 'IV', name: 'The Emperor',
    desc: 'A powerful mature emperor seated on a stone throne decorated with ram heads, wearing full armor and a crown. He holds an ankh scepter in one hand, an orb in the other. Barren rocky mountains behind him. Expression of absolute authority and stability. Crimson robe, strong imposing presence.'
  },
  {
    num: 5, roman: 'V', name: 'The Hierophant',
    desc: 'A wise religious figure in ceremonial robes and triple crown, seated on a throne between two stone pillars. His right hand raised in blessing gesture. Two figures kneel before him. A large golden cross or sacred symbol on his chest. Sacred keys crossed at his feet. Majestic cathedral-like atmosphere.'
  },
  {
    num: 6, roman: 'VI', name: 'The Lovers',
    desc: 'A man and woman standing beneath a radiant angel in golden light. A garden of Eden setting with an apple tree and a fiery tree. The angel blesses them from above with wings spread wide. Warm romantic golden light, flowers blooming around them. Expression of deep connection and divine love.'
  },
  {
    num: 7, roman: 'VII', name: 'The Chariot',
    desc: 'A victorious young warrior standing in a chariot pulled by two sphinxes (one black, one white). Wearing star-covered armor and a crown of laurel. Holding a wand of power. A city skyline behind him under a canopy of stars. Expression of triumph and willpower. Dynamic motion and energy.'
  },
  {
    num: 8, roman: 'VIII', name: 'Justice',
    desc: 'A dignified woman seated on a throne between two stone pillars, wearing red robes and a golden crown. In her right hand an upright sword pointing to the sky, in her left hand perfectly balanced golden scales. Expression of absolute fairness and truth. Symmetrical composition, cool authoritative light.'
  },
  {
    num: 9, roman: 'IX', name: 'The Hermit',
    desc: 'A solitary old wise man in grey robes standing alone on a snowy mountain peak at night. He holds a wooden staff in one hand and raises a lantern with a six-pointed star glowing inside in the other. Deep wrinkles, long white beard, contemplative expression. Dark stormy sky, isolated and wise.'
  },
  {
    num: 10, roman: 'X', name: 'Wheel of Fortune',
    desc: 'A great cosmic spinning wheel floating in the sky with mystical symbols (TORA, alchemical symbols). A sphinx sits atop the wheel holding a sword. A snake and Anubis-like figure on the wheel sides. Surrounded by four winged creatures in the corners (angel, eagle, lion, bull) each reading a book. Cosmic nebula background.'
  },
  {
    num: 11, roman: 'XI', name: 'Strength',
    desc: 'A graceful beautiful woman gently but confidently closing the mouth of a large powerful lion with her bare hands. She wears a white dress and a crown of flowers. An infinity symbol above her head. Serene green meadow, warm sunlight. Expression of calm inner power, the lion submits peacefully.'
  },
  {
    num: 12, roman: 'XII', name: 'The Hanged Man',
    desc: 'A young man hanging upside down by his right ankle from a T-shaped living tree branch, his left leg bent. He is perfectly calm, even peaceful. His face radiates enlightenment and acceptance. A golden halo around his head. He wears a red tights and a blue shirt. Ethereal misty forest background, blue and white tones.'
  },
  {
    num: 13, roman: 'XIII', name: 'Death',
    desc: 'A skeletal knight in dark black armor riding a magnificent white horse. Carrying a black flag with a white rose. Below him people of all stations (king, priest, child) bow or fall. Two towers in the misty background. The sun rises between the towers. Dark dramatic atmosphere, grey and black tones with pale light.'
  },
  {
    num: 14, roman: 'XIV', name: 'Temperance',
    desc: 'A beautiful ethereal angel with magnificent white wings standing at a tranquil river at golden sunset. Wearing a white flowing robe with a golden triangle symbol. Pouring glowing water between two golden chalices held in each hand. One foot on land, one in the water. Warm golden orange light, flowers growing at the riverbank.'
  },
  {
    num: 15, roman: 'XV', name: 'The Devil',
    desc: 'A powerful horned goat-headed demonic figure seated on a dark throne, large black bat wings spread behind him. A reversed pentagram above his head. A man and woman chained loosely at his feet (they could free themselves). Darkness and fire around him. Oppressive atmosphere but with a subtle sense that escape is possible.'
  },
  {
    num: 16, roman: 'XVI', name: 'The Tower',
    desc: 'A tall stone tower on a rocky cliff struck by a massive bolt of lightning at the very top. The crown of the tower is blown off by the lightning strike. Two human figures fall headlong from the burning tower, their arms spread wide. Dark storm clouds and rain. Dramatic red and orange flames, chaos and sudden change.'
  },
  {
    num: 17, roman: 'XVII', name: 'The Star',
    desc: 'A beautiful naked woman kneeling at the edge of a calm pool under a magnificent star-filled night sky. She pours water from two urns, one into the pool, one onto the land. Above her shines one large eight-pointed star surrounded by seven smaller stars. Green landscape, lush nature, ibis bird on a tree nearby. Peaceful serene hope.'
  },
  {
    num: 18, roman: 'XVIII', name: 'The Moon',
    desc: 'A large glowing full moon with a face in the night sky. Below it two towers stand on the horizon. A path winds between them into the distance. A dog and a wolf howl at the moon from either side. A crayfish emerges from a pool in the foreground. Deep blue mysterious atmosphere, darkness and illusion, tidal pools reflecting moonlight.'
  },
  {
    num: 19, roman: 'XIX', name: 'The Sun',
    desc: 'A radiant joyful child riding a white horse triumphantly beneath a huge brilliant sun with a face. The child waves a large red banner, sunflowers bloom behind a low wall. The sun has long rays alternating straight and wavy. Pure happiness, golden light, blue sky. Warmth, success, and pure joy radiating from the scene.'
  },
  {
    num: 20, roman: 'XX', name: 'Judgement',
    desc: 'The archangel Gabriel flying in the sky above clouds, blowing a golden trumpet with a banner bearing a cross. Below, naked figures rise from open coffins stretching their arms upward toward the angel. Mountains and water in the background. Dramatic light from above piercing the clouds. A moment of spiritual awakening and resurrection.'
  },
  {
    num: 21, roman: 'XXI', name: 'The World',
    desc: 'A beautiful nude woman dancing gracefully inside a large oval wreath of laurel. She holds two wands. In the four corners of the card: a winged angel, an eagle, a lion, and a bull. She is wrapped in a purple sash. Cosmic starry background. Expression of completion, wholeness, and the dance of eternity.'
  },
  {
    num: 22, roman: '0', name: 'The Fool',
    desc: 'A carefree young wanderer stepping joyfully toward the edge of a cliff, gazing upward at the sky. Wearing colorful patchwork clothes and a flower crown. Carrying a small bag on a stick over his shoulder. A small white dog playfully nipping at his heels. Bright blue sky, mountains in distance. Expression of pure innocence and new beginnings.'
  },
];

async function generateImage(arcana) {
  const prompt = `${STYLE}\n\nCard: ${arcana.roman} - ${arcana.name}\n\nScene: ${arcana.desc}`;

  const body = JSON.stringify({
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1024x1536',
    quality: 'high'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.proxyapi.ru',
      path: '/openai/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('API response:', JSON.stringify(parsed).slice(0, 300));
          if (parsed.error) reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
          else if (parsed.data && parsed.data[0]?.b64_json) resolve({ type: 'b64', data: parsed.data[0].b64_json });
          else if (parsed.data && parsed.data[0]?.url) resolve({ type: 'url', data: parsed.data[0].url });
          else reject(new Error('Unexpected response: ' + JSON.stringify(parsed).slice(0, 200)));
        } catch (e) {
          console.log('Raw response:', data.slice(0, 300));
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`🎴 Генерация ${ARCANA.length} карт Таро...\n`);

  const errors = [];

  for (let i = 0; i < ARCANA.length; i++) {
    const arcana = ARCANA[i];
    const filepath = path.join(OUTPUT_DIR, `arcana-${arcana.num}.png`);

    // Пропускаем уже сгенерированные
    if (fs.existsSync(filepath)) {
      console.log(`⏭  ${arcana.roman} ${arcana.name} — уже есть, пропускаем`);
      continue;
    }

    console.log(`🎨 [${i + 1}/${ARCANA.length}] Генерирую: ${arcana.roman} - ${arcana.name}...`);

    try {
      const result = await generateImage(arcana);
      if (result.type === 'b64') {
        fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
      } else {
        await downloadImage(result.data, filepath);
      }
      console.log(`✅ Сохранено: arcana-${arcana.num}.png`);

      // Пауза между запросами чтобы не превысить лимит
      if (i < ARCANA.length - 1) {
        console.log(`⏳ Пауза 3 сек...\n`);
        await sleep(3000);
      }
    } catch (err) {
      console.error(`❌ Ошибка для ${arcana.name}: ${err.message}`);
      errors.push({ arcana: arcana.name, error: err.message });
      await sleep(5000); // Дольше ждём при ошибке
    }
  }

  console.log('\n🎉 Готово!');
  if (errors.length > 0) {
    console.log('\n⚠️  Ошибки:');
    errors.forEach(e => console.log(`  - ${e.arcana}: ${e.error}`));
    console.log('\nЗапусти скрипт ещё раз — он пропустит уже готовые и сгенерирует только недостающие.');
  } else {
    console.log('Все 22 карты сгенерированы успешно!');
  }
}

main().catch(console.error);
