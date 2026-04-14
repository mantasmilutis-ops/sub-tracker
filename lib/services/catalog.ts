/**
 * lib/services/catalog.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Master catalog of subscription services.
 *
 * HOW TO ADD A SERVICE
 * ─────────────────────
 * Add one object to the CATALOG array:
 *
 *   {
 *     name: 'My Service',          // canonical display name
 *     aliases: ['ms', 'myserv'],   // optional lowercase alternates / abbreviations
 *     domain: 'myservice.com',     // used for logo fetching
 *     category: 'tools',           // see Category type
 *     price: 9.99,                 // monthly USD (optional)
 *     popular: true,               // show in "top suggestions" when field is empty
 *   },
 *
 * Price is always monthly. The form multiplies by 12 for yearly billing.
 * For services with variable pricing, omit `price`.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category =
  | 'entertainment'
  | 'music'
  | 'software'
  | 'tools'
  | 'gaming'
  | 'news'
  | 'health'
  | 'education'
  | 'other'

export type ServiceEntry = {
  /** Canonical display name shown in autocomplete and stored in the database */
  name: string
  /** Lowercase alternate names, abbreviations, or common misspellings */
  aliases?: string[]
  /** Domain used for logo fetching (Clearbit → Google favicon → letter avatar) */
  domain: string
  category: Category
  /** Monthly price in USD. Yearly-only plans: store (annual / 12). */
  price?: number
  /** Include in "top suggestions" shown when the search field is empty */
  popular?: boolean
  /**
   * Optional direct logo URL. When set, ServiceLogo skips the remote-fetch
   * tier system (Clearbit / Google) and uses this image directly.
   * Use an absolute URL or a path under /public (e.g. '/logos/myapp.png').
   */
  logoUrl?: string
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

export const CATALOG: ServiceEntry[] = [

  // ── Streaming / Entertainment ──────────────────────────────────────────────

  { name: 'Netflix',           aliases: ['nflx'],                                                    domain: 'netflix.com',          category: 'entertainment', price: 15.49, popular: true  },
  { name: 'Hulu',                                                                                    domain: 'hulu.com',             category: 'entertainment', price: 7.99,  popular: true  },
  { name: 'Disney+',           aliases: ['disney', 'disney plus', 'disneyplus'],                     domain: 'disneyplus.com',       category: 'entertainment', price: 7.99,  popular: true  },
  { name: 'Max',               aliases: ['hbo max', 'hbomax', 'hbo'],                                domain: 'max.com',              category: 'entertainment', price: 9.99,  popular: true  },
  { name: 'Prime Video',       aliases: ['amazon prime video', 'amazon video', 'prime video'],       domain: 'primevideo.com',       category: 'entertainment', price: 8.99,  popular: true  },
  { name: 'Amazon Prime',      aliases: ['prime', 'prime membership'],                               domain: 'amazon.com',           category: 'entertainment', price: 14.99                 },
  { name: 'Apple TV+',         aliases: ['apple tv', 'apple tv plus', 'appletv+', 'appletv'],        domain: 'tv.apple.com',         category: 'entertainment', price: 9.99,  popular: true  },
  { name: 'Paramount+',        aliases: ['paramount', 'paramount plus', 'paramountplus'],            domain: 'paramountplus.com',    category: 'entertainment', price: 5.99                  },
  { name: 'Peacock',           aliases: ['nbc peacock'],                                             domain: 'peacocktv.com',        category: 'entertainment', price: 5.99                  },
  { name: 'Crunchyroll',                                                                             domain: 'crunchyroll.com',      category: 'entertainment', price: 7.99                  },
  { name: 'Funimation',                                                                              domain: 'funimation.com',       category: 'entertainment', price: 7.99                  },
  { name: 'Shudder',                                                                                 domain: 'shudder.com',          category: 'entertainment', price: 5.99                  },
  { name: 'BritBox',           aliases: ['brit box'],                                                domain: 'britbox.com',          category: 'entertainment', price: 8.99                  },
  { name: 'Discovery+',        aliases: ['discovery plus', 'discovery'],                             domain: 'discoveryplus.com',    category: 'entertainment', price: 4.99                  },
  { name: 'ESPN+',             aliases: ['espn plus', 'espn'],                                       domain: 'espn.com',             category: 'entertainment', price: 10.99                 },
  { name: 'Starz',                                                                                   domain: 'starz.com',            category: 'entertainment', price: 8.99                  },
  { name: 'Showtime',                                                                                domain: 'showtime.com',         category: 'entertainment', price: 10.99                 },
  { name: 'Criterion Channel', aliases: ['criterion'],                                               domain: 'criterionchannel.com', category: 'entertainment', price: 10.99                 },
  { name: 'MUBI',                                                                                    domain: 'mubi.com',             category: 'entertainment', price: 10.99                 },
  { name: 'CuriosityStream',   aliases: ['curiosity stream'],                                        domain: 'curiositystream.com',  category: 'entertainment', price: 4.99                  },
  { name: 'YouTube Premium',   aliases: ['yt premium', 'youtube premium', 'youtube red'],            domain: 'youtube.com',          category: 'entertainment', price: 13.99, popular: true  },
  { name: 'YouTube TV',        aliases: ['yt tv'],                                                   domain: 'tv.youtube.com',       category: 'entertainment', price: 72.99                 },
  { name: 'Twitch',            aliases: ['twitch turbo'],                                            domain: 'twitch.tv',            category: 'entertainment', price: 8.99                  },
  { name: 'DAZN',                                                                                    domain: 'dazn.com',             category: 'entertainment', price: 19.99                 },
  { name: 'FuboTV',            aliases: ['fubo'],                                                    domain: 'fubo.tv',              category: 'entertainment', price: 74.99                 },
  { name: 'Sling TV',          aliases: ['sling'],                                                   domain: 'sling.com',            category: 'entertainment', price: 40.00                 },
  { name: 'Philo',                                                                                   domain: 'philo.com',            category: 'entertainment', price: 25.00                 },
  { name: 'Plex Pass',         aliases: ['plex'],                                                    domain: 'plex.tv',              category: 'entertainment', price: 4.99                  },
  { name: 'Audible',           aliases: ['audible plus'],                                            domain: 'audible.com',          category: 'entertainment', price: 14.95                 },
  { name: 'Kindle Unlimited',  aliases: ['kindle'],                                                  domain: 'amazon.com',           category: 'entertainment', price: 11.99                 },
  { name: 'Scribd',                                                                                  domain: 'scribd.com',           category: 'entertainment', price: 11.99                 },

  // ── Music ──────────────────────────────────────────────────────────────────

  { name: 'Spotify',           aliases: ['spotify premium'],                                         domain: 'spotify.com',          category: 'music',         price: 11.99, popular: true  },
  { name: 'Apple Music',       aliases: ['itunes music'],                                            domain: 'music.apple.com',      category: 'music',         price: 10.99, popular: true  },
  { name: 'YouTube Music',     aliases: ['yt music'],                                                domain: 'music.youtube.com',    category: 'music',         price: 10.99                 },
  { name: 'Tidal',             aliases: ['tidal hifi'],                                              domain: 'tidal.com',            category: 'music',         price: 10.99                 },
  { name: 'Deezer',                                                                                  domain: 'deezer.com',           category: 'music',         price: 10.99                 },
  { name: 'SoundCloud Go',     aliases: ['soundcloud', 'soundcloud go+'],                            domain: 'soundcloud.com',       category: 'music',         price: 9.99                  },
  { name: 'Amazon Music',      aliases: ['amazon music unlimited'],                                  domain: 'music.amazon.com',     category: 'music',         price: 9.99                  },
  { name: 'Pandora',           aliases: ['pandora premium'],                                         domain: 'pandora.com',          category: 'music',         price: 5.99                  },
  { name: 'Qobuz',                                                                                   domain: 'qobuz.com',            category: 'music',         price: 12.99                 },
  { name: 'iHeart Radio',      aliases: ['iheart', 'iheartradio'],                                   domain: 'iheart.com',           category: 'music',         price: 9.99                  },

  // ── Gaming ─────────────────────────────────────────────────────────────────

  { name: 'Xbox Game Pass',      aliases: ['xbox', 'game pass', 'xgp', 'microsoft game pass'],       domain: 'xbox.com',             category: 'gaming',        price: 14.99, popular: true  },
  { name: 'PlayStation Plus',    aliases: ['ps plus', 'ps+', 'psn', 'playstation', 'psplus'],        domain: 'playstation.com',      category: 'gaming',        price: 17.99, popular: true  },
  { name: 'Nintendo Switch Online', aliases: ['nso', 'nintendo online', 'nintendo'],                 domain: 'nintendo.com',         category: 'gaming',        price: 3.99,  popular: true  },
  { name: 'EA Play',             aliases: ['ea access', 'origin access'],                            domain: 'ea.com',               category: 'gaming',        price: 4.99                  },
  { name: 'Apple Arcade',        aliases: ['arcade'],                                                domain: 'apple.com',            category: 'gaming',        price: 6.99                  },
  { name: 'Ubisoft+',            aliases: ['ubisoft plus', 'uplay plus'],                            domain: 'ubisoft.com',          category: 'gaming',        price: 17.99                 },
  { name: 'GeForce Now',         aliases: ['gfn', 'nvidia geforce now'],                             domain: 'nvidia.com',           category: 'gaming',        price: 9.99                  },
  { name: 'PC Game Pass',                                                                            domain: 'xbox.com',             category: 'gaming',        price: 9.99                  },
  { name: 'Humble Bundle',       aliases: ['humble', 'humble choice'],                               domain: 'humblebundle.com',     category: 'gaming',        price: 11.99                 },

  // ── Cloud / Storage ────────────────────────────────────────────────────────

  { name: 'Google One',        aliases: ['google storage', 'google cloud storage'],                  domain: 'one.google.com',       category: 'tools',         price: 2.99,  popular: true  },
  { name: 'Google Drive',      aliases: ['gdrive'],                                                  domain: 'drive.google.com',     category: 'tools',         price: 2.99                  },
  { name: 'iCloud+',           aliases: ['icloud', 'apple icloud', 'apple storage', 'apple cloud'], domain: 'icloud.com',           category: 'tools',         price: 2.99,  popular: true  },
  { name: 'Dropbox',           aliases: ['dropbox plus', 'dropbox professional'],                    domain: 'dropbox.com',          category: 'tools',         price: 11.99, popular: true  },
  { name: 'OneDrive',          aliases: ['microsoft onedrive', 'ms onedrive'],                       domain: 'onedrive.live.com',    category: 'tools',         price: 1.99                  },
  { name: 'Box',               aliases: ['box.com'],                                                 domain: 'box.com',              category: 'tools',         price: 10.00                 },
  { name: 'pCloud',                                                                                  domain: 'pcloud.com',           category: 'tools',         price: 4.99                  },
  { name: 'Backblaze',                                                                               domain: 'backblaze.com',        category: 'tools',         price: 7.00                  },
  { name: 'MEGA',              aliases: ['mega.nz'],                                                 domain: 'mega.nz',              category: 'tools',         price: 4.99                  },
  { name: 'Tresorit',                                                                                domain: 'tresorit.com',         category: 'tools',         price: 10.42                 },
  { name: 'Sync.com',          aliases: ['sync'],                                                    domain: 'sync.com',             category: 'tools',         price: 8.00                  },

  // ── Productivity / Collaboration ───────────────────────────────────────────

  { name: 'Notion',            aliases: ['notion.so'],                                               domain: 'notion.so',            category: 'tools',         price: 8.00,  popular: true  },
  { name: 'Slack',                                                                                   domain: 'slack.com',            category: 'tools',         price: 7.25,  popular: true  },
  { name: 'Zoom',              aliases: ['zoom meetings', 'zoom pro'],                               domain: 'zoom.us',              category: 'tools',         price: 13.33, popular: true  },
  { name: 'Microsoft Teams',   aliases: ['teams', 'ms teams'],                                       domain: 'microsoft.com',        category: 'tools',         price: 4.00                  },
  { name: 'Trello',                                                                                  domain: 'trello.com',           category: 'tools',         price: 5.00                  },
  { name: 'Asana',                                                                                   domain: 'asana.com',            category: 'tools',         price: 10.99                 },
  { name: 'Monday.com',        aliases: ['monday'],                                                  domain: 'monday.com',           category: 'tools',         price: 9.00,  popular: true  },
  { name: 'ClickUp',           aliases: ['click up'],                                                domain: 'clickup.com',          category: 'tools',         price: 7.00                  },
  { name: 'Airtable',                                                                                domain: 'airtable.com',         category: 'tools',         price: 10.00                 },
  { name: 'Todoist',                                                                                 domain: 'todoist.com',          category: 'tools',         price: 4.00                  },
  { name: 'Linear',                                                                                  domain: 'linear.app',           category: 'tools',         price: 8.00                  },
  { name: 'Basecamp',                                                                                domain: 'basecamp.com',         category: 'tools',         price: 15.00                 },
  { name: 'Jira',              aliases: ['atlassian jira', 'jira software'],                         domain: 'atlassian.com',        category: 'software',      price: 7.75                  },
  { name: 'Confluence',        aliases: ['atlassian confluence'],                                    domain: 'atlassian.com',        category: 'software',      price: 5.75                  },
  { name: 'Smartsheet',                                                                              domain: 'smartsheet.com',       category: 'tools',         price: 9.00                  },
  { name: 'Wrike',                                                                                   domain: 'wrike.com',            category: 'tools',         price: 9.80                  },
  { name: 'Harvest',                                                                                 domain: 'getharvest.com',       category: 'tools',         price: 12.00                 },
  { name: 'Toggl',             aliases: ['toggl track'],                                             domain: 'toggl.com',            category: 'tools',         price: 9.00                  },
  { name: 'Loom',                                                                                    domain: 'loom.com',             category: 'tools',         price: 12.50                 },
  { name: 'Miro',                                                                                    domain: 'miro.com',             category: 'tools',         price: 8.00                  },
  { name: 'Typeform',                                                                                domain: 'typeform.com',         category: 'tools',         price: 25.00                 },
  { name: 'SurveyMonkey',      aliases: ['survey monkey'],                                           domain: 'surveymonkey.com',     category: 'tools',         price: 25.00                 },
  { name: 'Webex',             aliases: ['cisco webex'],                                              domain: 'webex.com',            category: 'tools',         price: 14.50                 },
  { name: 'Whereby',                                                                                 domain: 'whereby.com',          category: 'tools',         price: 6.99                  },
  { name: 'Descript',                                                                                domain: 'descript.com',         category: 'tools',         price: 12.00                 },

  // ── Developer Tools ────────────────────────────────────────────────────────

  { name: 'GitHub Pro',        aliases: ['github', 'gh', 'gh pro'],                                  domain: 'github.com',           category: 'software',      price: 4.00,  popular: true  },
  { name: 'GitHub Copilot',    aliases: ['copilot', 'gh copilot', 'github copilot'],                 domain: 'github.com',           category: 'software',      price: 10.00, popular: true  },
  { name: 'GitLab',            aliases: ['gitlab premium'],                                          domain: 'gitlab.com',           category: 'software',      price: 19.00                 },
  { name: 'Bitbucket',                                                                               domain: 'bitbucket.org',        category: 'software',      price: 3.00                  },
  { name: 'Vercel',                                                                                  domain: 'vercel.com',           category: 'software',      price: 20.00, popular: true  },
  { name: 'Netlify',                                                                                 domain: 'netlify.com',          category: 'software',      price: 19.00                 },
  { name: 'Railway',                                                                                 domain: 'railway.app',          category: 'software',      price: 5.00                  },
  { name: 'Render',                                                                                  domain: 'render.com',           category: 'software',      price: 7.00                  },
  { name: 'DigitalOcean',      aliases: ['digital ocean', 'do'],                                     domain: 'digitalocean.com',     category: 'software',      price: 6.00                  },
  { name: 'Cloudflare',        aliases: ['cf', 'cloudflare pro'],                                    domain: 'cloudflare.com',       category: 'software',      price: 20.00                 },
  { name: 'AWS',               aliases: ['amazon web services', 'amazon aws'],                       domain: 'aws.amazon.com',       category: 'software'                                     },
  { name: 'Heroku',                                                                                  domain: 'heroku.com',           category: 'software',      price: 5.00                  },
  { name: 'Fly.io',            aliases: ['fly', 'fly io'],                                           domain: 'fly.io',               category: 'software',      price: 10.00                 },
  { name: 'Cursor',            aliases: ['cursor ai', 'cursor.sh', 'cursor editor'],                 domain: 'cursor.sh',            category: 'software',      price: 20.00, popular: true  },
  { name: 'Sentry',                                                                                  domain: 'sentry.io',            category: 'software',      price: 26.00                 },
  { name: 'Datadog',                                                                                 domain: 'datadoghq.com',        category: 'software',      price: 15.00                 },
  { name: 'PagerDuty',         aliases: ['pager duty'],                                              domain: 'pagerduty.com',        category: 'software',      price: 21.00                 },
  { name: 'New Relic',         aliases: ['newrelic'],                                                domain: 'newrelic.com',         category: 'software',      price: 25.00                 },
  { name: 'Postman',                                                                                 domain: 'postman.com',          category: 'software',      price: 12.00                 },
  { name: 'Retool',                                                                                  domain: 'retool.com',           category: 'software',      price: 10.00                 },
  { name: 'Supabase',                                                                                domain: 'supabase.com',         category: 'software',      price: 25.00                 },
  { name: 'PlanetScale',       aliases: ['planet scale'],                                            domain: 'planetscale.com',      category: 'software',      price: 29.00                 },
  { name: 'Neon',              aliases: ['neon database', 'neon db'],                                domain: 'neon.tech',            category: 'software',      price: 19.00                 },
  { name: 'CircleCI',          aliases: ['circle ci'],                                               domain: 'circleci.com',         category: 'software',      price: 30.00                 },
  { name: 'Stripe',                                                                                  domain: 'stripe.com',           category: 'software'                                     },
  { name: 'Twilio',                                                                                  domain: 'twilio.com',           category: 'software'                                     },
  { name: 'SendGrid',                                                                                domain: 'sendgrid.com',         category: 'software',      price: 19.95                 },
  { name: 'Resend',                                                                                  domain: 'resend.com',           category: 'software',      price: 20.00                 },
  { name: 'Algolia',                                                                                 domain: 'algolia.com',          category: 'software',      price: 100.00                },
  { name: 'MongoDB Atlas',     aliases: ['mongodb', 'mongo', 'atlas'],                               domain: 'mongodb.com',          category: 'software',      price: 57.00                 },
  { name: 'Tabnine',                                                                                 domain: 'tabnine.com',          category: 'software',      price: 12.00                 },
  { name: 'Codeium',                                                                                 domain: 'codeium.com',          category: 'software',      price: 10.00                 },

  // ── Design / Creative ──────────────────────────────────────────────────────

  { name: 'Figma',             aliases: ['figma professional'],                                       domain: 'figma.com',            category: 'software',      price: 12.00, popular: true  },
  { name: 'Canva Pro',         aliases: ['canva'],                                                   domain: 'canva.com',            category: 'software',      price: 12.99, popular: true  },
  { name: 'Adobe Creative Cloud', aliases: ['adobe', 'adobe cc', 'creative cloud', 'cc', 'adobe suite', 'adobe cloud'], domain: 'adobe.com', category: 'software', price: 54.99, popular: true },
  { name: 'Adobe Photoshop',   aliases: ['photoshop'],                                               domain: 'adobe.com',            category: 'software',      price: 22.99                 },
  { name: 'Adobe Illustrator', aliases: ['illustrator'],                                             domain: 'adobe.com',            category: 'software',      price: 22.99                 },
  { name: 'Adobe Premiere Pro',aliases: ['premiere', 'premiere pro'],                                domain: 'adobe.com',            category: 'software',      price: 22.99                 },
  { name: 'Adobe After Effects',aliases: ['after effects', 'ae'],                                    domain: 'adobe.com',            category: 'software',      price: 22.99                 },
  { name: 'Sketch',                                                                                  domain: 'sketch.com',           category: 'software',      price: 9.00                  },
  { name: 'Webflow',                                                                                 domain: 'webflow.com',          category: 'software',      price: 14.00                 },
  { name: 'Framer',                                                                                  domain: 'framer.com',           category: 'software',      price: 5.00                  },
  { name: 'InVision',          aliases: ['invision app'],                                            domain: 'invisionapp.com',      category: 'software',      price: 7.95                  },
  { name: 'Zeplin',                                                                                  domain: 'zeplin.io',            category: 'software',      price: 6.25                  },
  { name: 'Affinity',          aliases: ['affinity photo', 'affinity designer'],                     domain: 'affinity.serif.com',   category: 'software',      price: 6.49                  },
  { name: 'LottieFiles',       aliases: ['lottie'],                                                  domain: 'lottiefiles.com',      category: 'software',      price: 12.00                 },
  { name: 'Runway',            aliases: ['runway ml', 'runway ai', 'runwayml'],                      domain: 'runwayml.com',         category: 'software',      price: 15.00                 },

  // ── Microsoft / Google / Apple bundles ────────────────────────────────────

  { name: 'Microsoft 365',     aliases: ['office 365', 'ms365', 'm365', 'office', 'microsoft office'], domain: 'microsoft.com',     category: 'software',      price: 6.99,  popular: true  },
  { name: 'Google Workspace',  aliases: ['gsuite', 'g suite', 'google apps'],                        domain: 'workspace.google.com',category: 'tools',         price: 6.00,  popular: true  },
  { name: 'Apple One',         aliases: ['apple bundle'],                                            domain: 'apple.com',            category: 'software',      price: 19.95                 },
  { name: 'Apple Fitness+',    aliases: ['apple fitness', 'fitness plus'],                           domain: 'apple.com',            category: 'health',        price: 9.99                  },

  // ── Security / VPN / Privacy ──────────────────────────────────────────────

  { name: '1Password',         aliases: ['onepassword', '1pass', 'one password'],                    domain: '1password.com',        category: 'tools',         price: 2.99,  popular: true  },
  { name: 'Bitwarden',                                                                               domain: 'bitwarden.com',        category: 'tools',         price: 0.83                  },
  { name: 'LastPass',          aliases: ['last pass'],                                               domain: 'lastpass.com',         category: 'tools',         price: 3.00                  },
  { name: 'Dashlane',                                                                                domain: 'dashlane.com',         category: 'tools',         price: 4.99                  },
  { name: 'Keeper',            aliases: ['keeper security'],                                         domain: 'keepersecurity.com',   category: 'tools',         price: 2.91                  },
  { name: 'NordVPN',           aliases: ['nord vpn', 'nord'],                                        domain: 'nordvpn.com',          category: 'tools',         price: 3.99,  popular: true  },
  { name: 'ExpressVPN',        aliases: ['express vpn'],                                             domain: 'expressvpn.com',       category: 'tools',         price: 6.67                  },
  { name: 'Surfshark',                                                                               domain: 'surfshark.com',        category: 'tools',         price: 2.49                  },
  { name: 'ProtonVPN',         aliases: ['proton vpn'],                                              domain: 'protonvpn.com',        category: 'tools',         price: 4.99                  },
  { name: 'Mullvad',           aliases: ['mullvad vpn'],                                             domain: 'mullvad.net',          category: 'tools',         price: 5.41                  },
  { name: 'Proton Mail',       aliases: ['protonmail', 'proton'],                                    domain: 'proton.me',            category: 'tools',         price: 3.99                  },
  { name: 'FastMail',          aliases: ['fast mail'],                                               domain: 'fastmail.com',         category: 'tools',         price: 3.00                  },
  { name: 'Tutanota',          aliases: ['tuta'],                                                    domain: 'tutanota.com',         category: 'tools',         price: 1.20                  },

  // ── AI Tools ──────────────────────────────────────────────────────────────

  { name: 'ChatGPT Plus',      aliases: ['chatgpt', 'openai', 'gpt', 'gpt4', 'gpt-4', 'chat gpt', 'openai chatgpt', 'gpt plus'], domain: 'openai.com', category: 'software', price: 20.00, popular: true },
  { name: 'Claude Pro',        aliases: ['claude', 'anthropic', 'claude ai'],                        domain: 'claude.ai',            category: 'software',      price: 20.00, popular: true  },
  { name: 'Midjourney',        aliases: ['mj', 'mid journey'],                                       domain: 'midjourney.com',       category: 'software',      price: 10.00, popular: true  },
  { name: 'Perplexity Pro',    aliases: ['perplexity', 'perplexity ai'],                             domain: 'perplexity.ai',        category: 'software',      price: 20.00                 },
  { name: 'Jasper',            aliases: ['jasper ai'],                                               domain: 'jasper.ai',            category: 'software',      price: 39.00                 },
  { name: 'ElevenLabs',        aliases: ['eleven labs'],                                             domain: 'elevenlabs.io',        category: 'software',      price: 22.00                 },
  { name: 'Synthesia',                                                                               domain: 'synthesia.io',         category: 'software',      price: 22.00                 },
  { name: 'Copy.ai',           aliases: ['copyai', 'copy ai'],                                       domain: 'copy.ai',              category: 'software',      price: 36.00                 },
  { name: 'Writesonic',                                                                              domain: 'writesonic.com',       category: 'software',      price: 12.67                 },
  { name: 'Poe',               aliases: ['poe ai', 'quora poe'],                                     domain: 'poe.com',              category: 'software',      price: 19.99                 },
  { name: 'Character.ai',      aliases: ['character ai', 'c.ai'],                                   domain: 'character.ai',         category: 'software',      price: 9.99                  },
  { name: 'Grammarly',         aliases: ['grammarly premium'],                                       domain: 'grammarly.com',        category: 'tools',         price: 12.00, popular: true  },
  { name: 'Notion AI',         aliases: ['notion-ai'],                                               domain: 'notion.so',            category: 'tools',         price: 8.00                  },

  // ── Finance ────────────────────────────────────────────────────────────────

  { name: 'Revolut Premium',   aliases: ['revolut', 'revolut plus'],                                 domain: 'revolut.com',          category: 'other',         price: 9.99                  },
  { name: 'Monzo Plus',        aliases: ['monzo'],                                                   domain: 'monzo.com',            category: 'other',         price: 5.00                  },
  { name: 'Wise',              aliases: ['transferwise'],                                            domain: 'wise.com',             category: 'other'                                        },
  { name: 'YNAB',              aliases: ['you need a budget'],                                       domain: 'ynab.com',             category: 'other',         price: 14.99                 },
  { name: 'Quicken',                                                                                 domain: 'quicken.com',          category: 'other',         price: 5.99                  },
  { name: 'QuickBooks',        aliases: ['qbo', 'quickbooks online'],                                domain: 'quickbooks.intuit.com', category: 'other',        price: 30.00                 },
  { name: 'FreshBooks',        aliases: ['fresh books'],                                             domain: 'freshbooks.com',       category: 'other',         price: 17.00                 },
  { name: 'Xero',                                                                                    domain: 'xero.com',             category: 'other',         price: 13.00                 },

  // ── Education ─────────────────────────────────────────────────────────────

  { name: 'Duolingo Plus',     aliases: ['duolingo', 'duolingo super', 'duolingo premium'],           domain: 'duolingo.com',         category: 'education',     price: 6.99,  popular: true  },
  { name: 'Coursera Plus',     aliases: ['coursera'],                                                domain: 'coursera.org',         category: 'education',     price: 59.00, popular: true  },
  { name: 'MasterClass',       aliases: ['master class'],                                            domain: 'masterclass.com',      category: 'education',     price: 10.00                 },
  { name: 'Udemy',                                                                                   domain: 'udemy.com',            category: 'education',     price: 16.58                 },
  { name: 'Skillshare',        aliases: ['skill share'],                                             domain: 'skillshare.com',       category: 'education',     price: 16.50                 },
  { name: 'Brilliant',                                                                               domain: 'brilliant.org',        category: 'education',     price: 12.49                 },
  { name: 'Pluralsight',                                                                             domain: 'pluralsight.com',      category: 'education',     price: 29.00                 },
  { name: 'LinkedIn Learning', aliases: ['linkedin learning', 'lynda'],                              domain: 'linkedin.com',         category: 'education',     price: 39.99                 },
  { name: 'Babbel',                                                                                  domain: 'babbel.com',           category: 'education',     price: 13.95                 },
  { name: 'Rosetta Stone',     aliases: ['rosetta'],                                                 domain: 'rosettastone.com',     category: 'education',     price: 11.99                 },
  { name: 'Codecademy',        aliases: ['code academy'],                                            domain: 'codecademy.com',       category: 'education',     price: 17.49                 },
  { name: 'DataCamp',          aliases: ['data camp'],                                               domain: 'datacamp.com',         category: 'education',     price: 25.00                 },
  { name: 'Frontend Masters',  aliases: ['frontendmasters'],                                         domain: 'frontendmasters.com',  category: 'education',     price: 39.00                 },
  { name: 'Egghead',                                                                                 domain: 'egghead.io',           category: 'education',     price: 12.50                 },
  { name: 'Scrimba',                                                                                 domain: 'scrimba.com',          category: 'education',     price: 28.00                 },
  { name: 'Khan Academy',      aliases: ['khan'],                                                    domain: 'khanacademy.org',      category: 'education'                                    },
  { name: 'Blinkist',                                                                                domain: 'blinkist.com',         category: 'education',     price: 15.99                 },

  // ── Health / Fitness ──────────────────────────────────────────────────────

  { name: 'Headspace',                                                                               domain: 'headspace.com',        category: 'health',        price: 12.99, popular: true  },
  { name: 'Calm',                                                                                    domain: 'calm.com',             category: 'health',        price: 14.99, popular: true  },
  { name: 'Peloton',           aliases: ['peloton app'],                                             domain: 'peloton.com',          category: 'health',        price: 12.99                 },
  { name: 'WHOOP',             aliases: ['whoop'],                                                   domain: 'whoop.com',            category: 'health',        price: 30.00                 },
  { name: 'Strava',                                                                                  domain: 'strava.com',           category: 'health',        price: 5.00                  },
  { name: 'Eight Sleep',       aliases: ['eightsleep', '8sleep'],                                    domain: 'eightsleep.com',       category: 'health',        price: 19.00                 },
  { name: 'Noom',                                                                                    domain: 'noom.com',             category: 'health',        price: 60.00                 },
  { name: 'MyFitnessPal',      aliases: ['my fitness pal', 'mfp'],                                   domain: 'myfitnesspal.com',     category: 'health',        price: 9.99                  },
  { name: 'BetterHelp',        aliases: ['better help'],                                             domain: 'betterhelp.com',       category: 'health',        price: 70.00                 },
  { name: 'Talkspace',                                                                               domain: 'talkspace.com',        category: 'health',        price: 99.00                 },
  { name: 'Fitbit Premium',    aliases: ['fitbit'],                                                  domain: 'fitbit.com',           category: 'health',        price: 9.99                  },
  { name: 'Nike Training Club',aliases: ['ntc', 'nike training'],                                    domain: 'nike.com',             category: 'health',        price: 14.99                 },

  // ── News / Reading ────────────────────────────────────────────────────────

  { name: 'New York Times',    aliases: ['nyt', 'ny times', 'the new york times'],                   domain: 'nytimes.com',          category: 'news',          price: 17.00, popular: true  },
  { name: 'The Economist',     aliases: ['economist'],                                               domain: 'economist.com',        category: 'news',          price: 22.00                 },
  { name: 'Wall Street Journal', aliases: ['wsj', 'the wsj'],                                        domain: 'wsj.com',              category: 'news',          price: 17.00                 },
  { name: 'The Atlantic',      aliases: ['atlantic'],                                                domain: 'theatlantic.com',      category: 'news',          price: 9.99                  },
  { name: 'Financial Times',   aliases: ['ft', 'the ft'],                                            domain: 'ft.com',               category: 'news',          price: 33.00                 },
  { name: 'Bloomberg',         aliases: ['bloomberg pro'],                                           domain: 'bloomberg.com',        category: 'news',          price: 34.99                 },
  { name: 'Washington Post',   aliases: ['wapo'],                                                    domain: 'washingtonpost.com',   category: 'news',          price: 10.00                 },
  { name: 'Medium',                                                                                  domain: 'medium.com',           category: 'news',          price: 5.00                  },
  { name: 'Substack',                                                                                domain: 'substack.com',         category: 'news'                                         },
  { name: 'SubTracker',          aliases: ['sub tracker', 'subtracker'],                              domain: 'subtracker.app',       category: 'news',  price: 0,  logoUrl: '__app__' },
  { name: 'Pocket Premium',    aliases: ['pocket', 'getpocket'],                                     domain: 'getpocket.com',        category: 'news',          price: 4.99                  },
  { name: 'Readwise',          aliases: ['readwise reader'],                                         domain: 'readwise.io',          category: 'news',          price: 7.99                  },

  // ── Communication / Social ────────────────────────────────────────────────

  { name: 'Discord Nitro',     aliases: ['discord', 'nitro', 'discord nitro'],                       domain: 'discord.com',          category: 'other',         price: 9.99,  popular: true  },
  { name: 'Telegram Premium',  aliases: ['telegram'],                                                domain: 'telegram.org',         category: 'other',         price: 4.99                  },
  { name: 'X Premium',         aliases: ['twitter', 'twitter blue', 'x', 'twitter premium'],         domain: 'x.com',                category: 'other',         price: 8.00                  },
  { name: 'LinkedIn Premium',  aliases: ['linkedin', 'li premium'],                                  domain: 'linkedin.com',         category: 'other',         price: 39.99                 },
  { name: 'Patreon',                                                                                 domain: 'patreon.com',          category: 'other'                                        },

  // ── E-commerce / Marketing / Business ─────────────────────────────────────

  { name: 'Shopify',           aliases: ['shopify basic'],                                           domain: 'shopify.com',          category: 'software',      price: 29.00, popular: true  },
  { name: 'Squarespace',       aliases: ['square space'],                                            domain: 'squarespace.com',      category: 'software',      price: 16.00                 },
  { name: 'Wix',                                                                                     domain: 'wix.com',              category: 'software',      price: 17.00                 },
  { name: 'WordPress.com',     aliases: ['wordpress', 'wp'],                                         domain: 'wordpress.com',        category: 'software',      price: 4.00                  },
  { name: 'Ghost',                                                                                   domain: 'ghost.org',            category: 'software',      price: 9.00                  },
  { name: 'Mailchimp',         aliases: ['mail chimp'],                                              domain: 'mailchimp.com',        category: 'other',         price: 13.00, popular: true  },
  { name: 'ConvertKit',        aliases: ['convert kit', 'kit'],                                      domain: 'convertkit.com',       category: 'other',         price: 9.00                  },
  { name: 'Klaviyo',                                                                                 domain: 'klaviyo.com',          category: 'other',         price: 20.00                 },
  { name: 'Beehiiv',                                                                                 domain: 'beehiiv.com',          category: 'other',         price: 39.00                 },
  { name: 'Buffer',                                                                                  domain: 'buffer.com',           category: 'other',         price: 6.00                  },
  { name: 'Hootsuite',         aliases: ['hoot suite'],                                              domain: 'hootsuite.com',        category: 'other',         price: 99.00                 },
  { name: 'Later',                                                                                   domain: 'later.com',            category: 'other',         price: 16.67                 },
  { name: 'HubSpot',           aliases: ['hub spot'],                                                domain: 'hubspot.com',          category: 'software',      price: 50.00, popular: true  },
  { name: 'Salesforce',        aliases: ['sf', 'sfdc'],                                              domain: 'salesforce.com',       category: 'software',      price: 25.00                 },
  { name: 'Zendesk',                                                                                 domain: 'zendesk.com',          category: 'software',      price: 19.00                 },
  { name: 'Intercom',                                                                                domain: 'intercom.com',         category: 'software',      price: 74.00                 },
  { name: 'Freshdesk',         aliases: ['freshworks'],                                              domain: 'freshdesk.com',        category: 'software',      price: 15.00                 },
  { name: 'Zapier',                                                                                  domain: 'zapier.com',           category: 'tools',         price: 19.99, popular: true  },
  { name: 'Make',              aliases: ['integromat', 'make.com'],                                  domain: 'make.com',             category: 'tools',         price: 9.00                  },
  { name: 'Pipedream',                                                                               domain: 'pipedream.com',        category: 'tools',         price: 19.00                 },
  { name: 'n8n',               aliases: ['n8n.io'],                                                  domain: 'n8n.io',               category: 'tools',         price: 20.00                 },

  // ── SEO / Analytics ───────────────────────────────────────────────────────

  { name: 'Ahrefs',                                                                                  domain: 'ahrefs.com',           category: 'tools',         price: 99.00                 },
  { name: 'SEMrush',           aliases: ['semrush'],                                                 domain: 'semrush.com',          category: 'tools',         price: 119.95                },
  { name: 'Moz Pro',           aliases: ['moz'],                                                     domain: 'moz.com',              category: 'tools',         price: 99.00                 },
  { name: 'Screaming Frog',    aliases: ['screamingfrog'],                                           domain: 'screamingfrog.co.uk',  category: 'tools',         price: 22.91                 },

]
