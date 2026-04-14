/**
 * lib/cancel-catalog.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cancellation URL catalog for 100+ subscription services.
 *
 * HOW TO ADD A SERVICE
 * ─────────────────────────────────────────────────────────────────────────────
 * Add one line to CATALOG. The key is the lowercase canonical name.
 * For alternate spellings / aliases, add extra keys pointing to the same URL.
 * No other file needs to change.
 *
 * HOW LOOKUP WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * getCancelUrl(name)       → exact URL or null
 * getFallbackSearchUrl(name) → Google "how to cancel X subscription" search
 *
 * Unknown services always get the Google fallback — never a dead end.
 */

// ─── Catalog ──────────────────────────────────────────────────────────────────

const CATALOG: Record<string, string> = {

  // ── Streaming video ────────────────────────────────────────────────────────
  'netflix':                   'https://www.netflix.com/cancelplan',
  'hulu':                      'https://secure.hulu.com/account/cancelsubscription',
  'disney+':                   'https://www.disneyplus.com/account/subscription',
  'disney plus':               'https://www.disneyplus.com/account/subscription',
  'disneyplus':                'https://www.disneyplus.com/account/subscription',
  'hbo max':                   'https://www.max.com/account/subscription',
  'max':                       'https://www.max.com/account/subscription',
  'peacock':                   'https://www.peacocktv.com/account',
  'peacock tv':                'https://www.peacocktv.com/account',
  'paramount+':                'https://www.paramountplus.com/account/',
  'paramount plus':            'https://www.paramountplus.com/account/',
  'apple tv+':                 'https://support.apple.com/en-us/108224',
  'apple tv plus':             'https://support.apple.com/en-us/108224',
  'appletv+':                  'https://support.apple.com/en-us/108224',
  'amazon prime':              'https://www.amazon.com/mc/cancel-amazon-prime',
  'amazon prime video':        'https://www.amazon.com/mc/cancel-amazon-prime',
  'prime video':               'https://www.amazon.com/mc/cancel-amazon-prime',
  'prime':                     'https://www.amazon.com/mc/cancel-amazon-prime',
  'youtube premium':           'https://youtube.com/paid_memberships',
  'youtube':                   'https://youtube.com/paid_memberships',
  'crunchyroll':               'https://www.crunchyroll.com/acct/membership',
  'funimation':                'https://www.funimation.com/account/',
  'mubi':                      'https://mubi.com/account/subscription',
  'shudder':                   'https://www.shudder.com/user/account',
  'discovery+':                'https://www.discoveryplus.com/account',
  'discovery plus':            'https://www.discoveryplus.com/account',
  'espn+':                     'https://www.espnplus.com/account',
  'espn plus':                 'https://www.espnplus.com/account',
  'fubo':                      'https://www.fubo.tv/account',
  'fubotv':                    'https://www.fubo.tv/account',
  'philo':                     'https://try.philo.com/account/',
  'sling tv':                  'https://watch.sling.com/account',
  'sling':                     'https://watch.sling.com/account',
  'britbox':                   'https://www.britbox.com/account',
  'apple one':                 'https://support.apple.com/en-us/111900',
  'moxie':                     'https://www.moxiestreaming.com/account',
  'curiosity stream':          'https://curiositystream.com/account',
  'curiositystream':           'https://curiositystream.com/account',
  'plex':                      'https://www.plex.tv/account/#billing',
  'plex pass':                 'https://www.plex.tv/account/#billing',
  'criterion channel':         'https://www.criterionchannel.com/account',
  'mhz choice':                'https://mhzchoice.com/account',

  // ── Music ─────────────────────────────────────────────────────────────────
  'spotify':                   'https://www.spotify.com/account/subscription/cancel',
  'apple music':               'https://support.apple.com/en-us/118428',
  'youtube music':             'https://youtube.com/paid_memberships',
  'amazon music':              'https://www.amazon.com/music/settings',
  'amazon music unlimited':    'https://www.amazon.com/music/settings',
  'tidal':                     'https://tidal.com/account/profile',
  'deezer':                    'https://www.deezer.com/account',
  'pandora':                   'https://www.pandora.com/account/cancel',
  'pandora premium':           'https://www.pandora.com/account/cancel',
  'siriusxm':                  'https://www.siriusxm.com/cancel',
  'sirius xm':                 'https://www.siriusxm.com/cancel',
  'soundcloud':                'https://soundcloud.com/settings/account',
  'soundcloud go':             'https://soundcloud.com/settings/account',
  'napster':                   'https://us.napster.com/account/settings',
  'idagio':                    'https://app.idagio.com/account',

  // ── Gaming ────────────────────────────────────────────────────────────────
  'xbox game pass':            'https://account.microsoft.com/services/',
  'game pass':                 'https://account.microsoft.com/services/',
  'xbox':                      'https://account.microsoft.com/services/',
  'xbox live':                 'https://account.microsoft.com/services/',
  'playstation plus':          'https://www.playstation.com/en-us/support/subscriptions/cancel-playstation-plus/',
  'ps plus':                   'https://www.playstation.com/en-us/support/subscriptions/cancel-playstation-plus/',
  'psn':                       'https://www.playstation.com/en-us/support/subscriptions/cancel-playstation-plus/',
  'nintendo switch online':    'https://accounts.nintendo.com/profile/edit/subscription',
  'nintendo online':           'https://accounts.nintendo.com/profile/edit/subscription',
  'ea play':                   'https://www.ea.com/ea-play/cancel',
  'origin access':             'https://www.ea.com/ea-play/cancel',
  'ubisoft+':                  'https://store.ubisoft.com/ubisoftplus',
  'ubisoft plus':              'https://store.ubisoft.com/ubisoftplus',
  'apple arcade':              'https://support.apple.com/en-us/111896',
  'google play pass':          'https://support.google.com/googleplay/answer/9644462',
  'play pass':                 'https://support.google.com/googleplay/answer/9644462',
  'geforce now':               'https://www.nvidia.com/en-us/geforce-now/cancel/',
  'nvidia geforce now':        'https://www.nvidia.com/en-us/geforce-now/cancel/',
  'shadow':                    'https://account.shadow.tech/',
  'shadow pc':                 'https://account.shadow.tech/',
  'twitch':                    'https://help.twitch.tv/s/article/prime-gaming-and-subscriptions',

  // ── Productivity & project management ─────────────────────────────────────
  'notion':                    'https://www.notion.so/help/change-or-cancel-your-plan',
  'evernote':                  'https://help.evernote.com/hc/en-us/articles/208313028',
  'asana':                     'https://asana.com/guide/help/premium/billing',
  'monday.com':                'https://support.monday.com/hc/en-us/articles/360002226599',
  'monday':                    'https://support.monday.com/hc/en-us/articles/360002226599',
  'clickup':                   'https://help.clickup.com/hc/en-us/articles/6305952763671',
  'todoist':                   'https://todoist.com/help/articles/cancel-subscription',
  'basecamp':                  'https://3.basecamp-help.com/article/43-cancel-account',
  'airtable':                  'https://support.airtable.com/docs/canceling-or-downgrading-your-airtable-plan',
  'trello':                    'https://support.atlassian.com/trello/docs/billing-faq/',
  'linear':                    'https://linear.app/settings/billing',
  'jira':                      'https://support.atlassian.com/subscriptions-and-billing/docs/cancel-your-subscription/',
  'confluence':                'https://support.atlassian.com/subscriptions-and-billing/docs/cancel-your-subscription/',
  'smartsheet':                'https://help.smartsheet.com/articles/504773',
  'wrike':                     'https://help.wrike.com/hc/en-us/articles/210165585',

  // ── Storage & cloud ───────────────────────────────────────────────────────
  'dropbox':                   'https://www.dropbox.com/account/plan',
  'icloud':                    'https://support.apple.com/en-us/111899',
  'icloud+':                   'https://support.apple.com/en-us/111899',
  'onedrive':                  'https://account.microsoft.com/services/',
  'microsoft 365':             'https://account.microsoft.com/services/',
  'microsoft office':          'https://account.microsoft.com/services/',
  'office 365':                'https://account.microsoft.com/services/',
  'google one':                'https://one.google.com/storage/manage-subscription',
  'google workspace':          'https://support.google.com/a/answer/1247360',
  'box':                       'https://support.box.com/hc/en-us/articles/360043695814',
  'backblaze':                 'https://www.backblaze.com/account_details.htm',
  'backblaze b2':              'https://www.backblaze.com/account_details.htm',
  'carbonite':                 'https://support.carbonite.com/articles/Public-Article-Cancel-My-Account',
  'pccloud':                   'https://www.pcloud.com/account/security.html',
  'pcloud':                    'https://www.pcloud.com/account/security.html',
  'mega':                      'https://mega.io/account',

  // ── Creative ──────────────────────────────────────────────────────────────
  'adobe':                     'https://helpx.adobe.com/manage-account/using/cancel-subscription.html',
  'adobe creative cloud':      'https://helpx.adobe.com/manage-account/using/cancel-subscription.html',
  'creative cloud':            'https://helpx.adobe.com/manage-account/using/cancel-subscription.html',
  'canva':                     'https://www.canva.com/settings/billing',
  'figma':                     'https://help.figma.com/hc/en-us/articles/360040328394',
  'sketch':                    'https://www.sketch.com/account/',
  'envato elements':           'https://elements.envato.com/account/subscription',
  'envato':                    'https://elements.envato.com/account/subscription',
  'shutterstock':              'https://www.shutterstock.com/account/subscriptions',
  'getty images':              'https://www.gettyimages.com/account/subscription',
  'unsplash+':                 'https://unsplash.com/account/billing',
  'storyblocks':               'https://www.storyblocks.com/account/subscription',
  'epidemic sound':            'https://www.epidemicsound.com/account',
  'artlist':                   'https://artlist.io/account',
  'procreate':                 'https://support.apple.com/en-us/118428',
  'affinity':                  'https://affinity.serif.com/en-us/store/',
  'davinci resolve':           'https://www.blackmagicdesign.com/account',

  // ── AI & writing tools ────────────────────────────────────────────────────
  'chatgpt':                   'https://help.openai.com/en/articles/7295966',
  'chatgpt plus':              'https://help.openai.com/en/articles/7295966',
  'openai':                    'https://help.openai.com/en/articles/7295966',
  'claude':                    'https://claude.ai/settings/billing',
  'claude pro':                'https://claude.ai/settings/billing',
  'anthropic':                 'https://claude.ai/settings/billing',
  'midjourney':                'https://docs.midjourney.com/docs/plans#cancel-a-plan',
  'grammarly':                 'https://support.grammarly.com/hc/en-us/articles/115000090651',
  'grammarly premium':         'https://support.grammarly.com/hc/en-us/articles/115000090651',
  'jasper':                    'https://support.jasper.ai/hc/en-us/articles/11052038476557',
  'jasper ai':                 'https://support.jasper.ai/hc/en-us/articles/11052038476557',
  'copy.ai':                   'https://docs.copy.ai/docs/cancel-your-plan',
  'copyai':                    'https://docs.copy.ai/docs/cancel-your-plan',
  'writesonic':                'https://help.writesonic.com/hc/en-us/articles/5534777009433',
  'notion ai':                 'https://www.notion.so/help/change-or-cancel-your-plan',
  'perplexity':                'https://www.perplexity.ai/settings/account',
  'perplexity ai':             'https://www.perplexity.ai/settings/account',
  'runway':                    'https://runwayml.com/pricing',
  'eleven labs':               'https://elevenlabs.io/account',
  'elevenlabs':                'https://elevenlabs.io/account',

  // ── Communication ─────────────────────────────────────────────────────────
  'zoom':                      'https://support.zoom.us/hc/en-us/articles/201362213',
  'slack':                     'https://slack.com/help/articles/214908388',
  'discord nitro':             'https://support.discord.com/hc/en-us/articles/360001164831',
  'discord':                   'https://support.discord.com/hc/en-us/articles/360001164831',
  'loom':                      'https://support.loom.com/hc/en-us/articles/360002268498',
  'calendly':                  'https://help.calendly.com/hc/en-us/articles/223207127',
  'skype':                     'https://account.microsoft.com/services/',
  'teams':                     'https://account.microsoft.com/services/',
  'microsoft teams':           'https://account.microsoft.com/services/',
  'webex':                     'https://help.webex.com/en-us/article/njzh3q/Cancel-a-Cisco-Webex-plan',
  'whereby':                   'https://whereby.com/user/profile/billing',

  // ── Developer & hosting ───────────────────────────────────────────────────
  'github':                    'https://docs.github.com/en/billing/managing-the-plan-for-your-github-account/downgrading-your-accounts-plan',
  'gitlab':                    'https://about.gitlab.com/pricing/',
  'vercel':                    'https://vercel.com/docs/accounts/plans/upgrade-downgrade',
  'netlify':                   'https://app.netlify.com/account/billing',
  'cloudflare':                'https://support.cloudflare.com/hc/en-us/articles/200167776',
  'digitalocean':              'https://docs.digitalocean.com/support/cancel-digitalocean-account/',
  'digital ocean':             'https://docs.digitalocean.com/support/cancel-digitalocean-account/',
  'heroku':                    'https://help.heroku.com/RSYGP7YA',
  'mongodb atlas':             'https://www.mongodb.com/docs/atlas/billing/terminate-free-tier-cluster/',
  'mongodb':                   'https://www.mongodb.com/docs/atlas/billing/',
  'datadog':                   'https://docs.datadoghq.com/account_management/billing/',
  'sentry':                    'https://sentry.io/settings/billing/',
  'new relic':                 'https://docs.newrelic.com/docs/accounts/accounts-billing/account-setup/downgradecancel-account/',
  'newrelic':                  'https://docs.newrelic.com/docs/accounts/accounts-billing/account-setup/downgradecancel-account/',
  'render':                    'https://render.com/docs/billing',
  'railway':                   'https://docs.railway.app/reference/pricing',
  'supabase':                  'https://supabase.com/dashboard/account/billing',
  'planetscale':               'https://planetscale.com/docs/concepts/billing',
  'postman':                   'https://www.postman.com/account/',

  // ── VPN & security ────────────────────────────────────────────────────────
  'nordvpn':                   'https://support.nordvpn.com/General-info/1399/How-to-cancel-my-NordVPN-subscription',
  'nord vpn':                  'https://support.nordvpn.com/General-info/1399/How-to-cancel-my-NordVPN-subscription',
  'expressvpn':                'https://www.expressvpn.com/support/troubleshooting/cancel-subscription/',
  'express vpn':               'https://www.expressvpn.com/support/troubleshooting/cancel-subscription/',
  'surfshark':                 'https://support.surfshark.com/hc/en-us/articles/360003030533',
  'protonvpn':                 'https://proton.me/support/cancel-protonvpn-subscription',
  'proton vpn':                'https://proton.me/support/cancel-protonvpn-subscription',
  'proton mail':               'https://proton.me/support/cancel-proton-plan',
  'protonmail':                'https://proton.me/support/cancel-proton-plan',
  'proton':                    'https://proton.me/support/cancel-proton-plan',
  'private internet access':   'https://www.privateinternetaccess.com/helpdesk/kb/articles/how-do-i-cancel-my-subscription',
  'pia':                       'https://www.privateinternetaccess.com/helpdesk/kb/articles/how-do-i-cancel-my-subscription',
  'mullvad':                   'https://mullvad.net/account/',
  '1password':                 'https://support.1password.com/cancel-subscription/',
  'one password':              'https://support.1password.com/cancel-subscription/',
  'lastpass':                  'https://support.lastpass.com/s/article/How-do-I-cancel-my-LastPass-subscription',
  'dashlane':                  'https://support.dashlane.com/hc/en-us/articles/202699181',
  'bitwarden':                 'https://bitwarden.com/help/delete-your-account/',
  'keeper':                    'https://docs.keeper.io/enterprise-guide/cancelling-keeper-subscription',
  'roboform':                  'https://www.roboform.com/billing',
  'malwarebytes':              'https://support.malwarebytes.com/hc/en-us/articles/360040246093',
  'norton':                    'https://support.norton.com/sp/en/us/home/current/solutions/v66736621',
  'norton 360':                'https://support.norton.com/sp/en/us/home/current/solutions/v66736621',
  'mcafee':                    'https://service.mcafee.com/webcenter/portal/oracle/webcenter/page/scopedMD/s55728c97_466d_4ddb_952d_05484ea932c6/Page27.jspx',
  'avast':                     'https://support.avast.com/en-us/article/Subscription-FAQs',
  'avg':                       'https://support.avg.com/SupportArticleView?l=en&urlname=Billing-cancellation-policy',

  // ── News & reading ────────────────────────────────────────────────────────
  'new york times':            'https://help.nytimes.com/hc/en-us/articles/360003499613',
  'nyt':                       'https://help.nytimes.com/hc/en-us/articles/360003499613',
  'washington post':           'https://helpcenter.washingtonpost.com/hc/en-us/articles/360002046852',
  'the guardian':              'https://manage.theguardian.com/cancel',
  'guardian':                  'https://manage.theguardian.com/cancel',
  'wall street journal':       'https://customercenter.wsj.com/subscription/cancel',
  'wsj':                       'https://customercenter.wsj.com/subscription/cancel',
  'the economist':             'https://www.economist.com/my-account',
  'economist':                 'https://www.economist.com/my-account',
  'wired':                     'https://www.wired.com/account/subscription',
  'medium':                    'https://help.medium.com/hc/en-us/articles/115004923947',
  'substack':                  'https://support.substack.com/hc/en-us/articles/360037852172',
  'audible':                   'https://www.audible.com/account/cancel',
  'kindle unlimited':          'https://www.amazon.com/hz/mycd/digital-console/subscription',
  'readwise':                  'https://readwise.io/billing',
  'readwise reader':           'https://readwise.io/billing',
  'pocket':                    'https://help.getpocket.com/article/1063-canceling-your-pocket-premium-subscription',
  'pocket premium':            'https://help.getpocket.com/article/1063-canceling-your-pocket-premium-subscription',
  'blinkist':                  'https://support.blinkist.com/hc/en-us/articles/115003010849',
  'scribd':                    'https://support.scribd.com/hc/en-us/articles/210134566',
  'newsela':                   'https://support.newsela.com/hc/en-us/articles/360017398453',

  // ── Health & fitness ──────────────────────────────────────────────────────
  'headspace':                 'https://help.headspace.com/hc/en-us/articles/115002059491',
  'calm':                      'https://support.calm.com/hc/en-us/articles/115005228668',
  'myfitnesspal':              'https://support.myfitnesspal.com/hc/en-us/articles/360032610651',
  'my fitness pal':            'https://support.myfitnesspal.com/hc/en-us/articles/360032610651',
  'noom':                      'https://support.noom.com/hc/en-us/articles/360039668311',
  'ww':                        'https://cmx.weightwatchers.com/account',
  'weight watchers':           'https://cmx.weightwatchers.com/account',
  'classpass':                 'https://support.classpass.com/hc/en-us/articles/205853867',
  'class pass':                'https://support.classpass.com/hc/en-us/articles/205853867',
  'strava':                    'https://www.strava.com/account',
  'whoop':                     'https://support.whoop.com/hc/en-us/articles/360046862453',
  'peloton':                   'https://support.onepeloton.com/hc/en-us/articles/360001872568',
  'peloton app':               'https://support.onepeloton.com/hc/en-us/articles/360001872568',
  'oura':                      'https://support.ouraring.com/hc/en-us/articles/360025440894',
  'oura ring':                 'https://support.ouraring.com/hc/en-us/articles/360025440894',
  'fitbit premium':            'https://support.google.com/fitbit/answer/10150557',
  'fitbit':                    'https://support.google.com/fitbit/answer/10150557',
  'apple fitness+':            'https://support.apple.com/en-us/111897',
  'fitness+':                  'https://support.apple.com/en-us/111897',

  // ── Finance ───────────────────────────────────────────────────────────────
  'ynab':                      'https://support.youneedabudget.com/article/130-cancelling-your-ynab-subscription',
  'you need a budget':         'https://support.youneedabudget.com/article/130-cancelling-your-ynab-subscription',
  'robinhood gold':            'https://robinhood.com/account/gold',
  'robinhood':                 'https://robinhood.com/account/gold',
  'quickbooks':                'https://quickbooks.intuit.com/learn-support/en-us/cancel-subscription/cancel-quickbooks-subscription/00/201361',
  'freshbooks':                'https://support.freshbooks.com/hc/en-us/articles/115000449443',
  'xero':                      'https://central.xero.com/s/article/Cancel-your-Xero-subscription',
  'mint':                      'https://help.intuit.com/app/answers/answer_view/a_id/247023',
  'personal capital':          'https://support.empower.com/s/article/How-do-I-cancel-my-account',
  'empower':                   'https://support.empower.com/s/article/How-do-I-cancel-my-account',

  // ── Learning & education ──────────────────────────────────────────────────
  'duolingo':                  'https://support.duolingo.com/hc/en-us/articles/115004019406',
  'duolingo plus':             'https://support.duolingo.com/hc/en-us/articles/115004019406',
  'linkedin premium':          'https://www.linkedin.com/premium/cancel',
  'linkedin':                  'https://www.linkedin.com/premium/cancel',
  'coursera':                  'https://learner.coursera.help/hc/en-us/articles/208279786',
  'coursera plus':             'https://learner.coursera.help/hc/en-us/articles/208279786',
  'skillshare':                'https://help.skillshare.com/hc/en-us/articles/205222927',
  'masterclass':               'https://help.masterclass.com/hc/en-us/articles/360030685251',
  'master class':              'https://help.masterclass.com/hc/en-us/articles/360030685251',
  'brilliant':                 'https://brilliant.org/account/',
  'udemy':                     'https://support.udemy.com/hc/en-us/articles/229232827',
  'pluralsight':               'https://help.pluralsight.com/hc/en-us/articles/208047406',
  'frontend masters':          'https://frontendmasters.com/settings/membership/',
  'o\'reilly':                 'https://www.oreilly.com/member/settings/',
  'oreilly':                   'https://www.oreilly.com/member/settings/',
  'mimo':                      'https://support.mimo.com/hc/en-us/articles/360013095200',
  'codecademy':                'https://help.codecademy.com/hc/en-us/articles/115000677927',

  // ── Design & no-code ──────────────────────────────────────────────────────
  'webflow':                   'https://university.webflow.com/lesson/cancel-a-site-plan',
  'squarespace':               'https://support.squarespace.com/hc/en-us/articles/205812578',
  'wix':                       'https://support.wix.com/en/article/canceling-your-wix-premium-plan',
  'wordpress.com':             'https://wordpress.com/support/manage-purchases/',
  'wordpress':                 'https://wordpress.com/support/manage-purchases/',
  'framer':                    'https://www.framer.com/support/',
  'bubble':                    'https://manual.bubble.io/account-and-billing/upgrading-your-plan#how-to-cancel-a-plan',

  // ── E-commerce & marketing ────────────────────────────────────────────────
  'shopify':                   'https://help.shopify.com/en/manual/your-account/close-your-store',
  'mailchimp':                 'https://mailchimp.com/help/cancel-a-monthly-plan/',
  'convertkit':                'https://help.convertkit.com/en/articles/3549027',
  'kit':                       'https://help.convertkit.com/en/articles/3549027',
  'hubspot':                   'https://knowledge.hubspot.com/account/cancel-your-hubspot-subscription',
  'semrush':                   'https://www.semrush.com/billing/',
  'ahrefs':                    'https://help.ahrefs.com/en/articles/1619576',
  'buffer':                    'https://support.buffer.com/article/437-canceling-your-buffer-subscription',
  'hootsuite':                 'https://help.hootsuite.com/hc/en-us/articles/1260801725070',

  // ── Miscellaneous ─────────────────────────────────────────────────────────
  'zapier':                    'https://zapier.com/account/billing',
  'make':                      'https://www.make.com/en/help/account/billing',
  'integromat':                'https://www.make.com/en/help/account/billing',
  'typeform':                  'https://www.typeform.com/help/a/how-to-cancel-your-typeform-subscription-360052202851/',
  'notion forms':              'https://www.notion.so/help/change-or-cancel-your-plan',
  'surveymonkey':              'https://help.surveymonkey.com/en/billing/cancel-account/',
  'docusign':                  'https://support.docusign.com/s/articles/How-do-I-cancel-or-downgrade-my-DocuSign-plan',
  'pandadoc':                  'https://support.pandadoc.com/hc/en-us/articles/360055015213',
  'hellosign':                 'https://support.hellosign.com/hc/en-us/articles/360007357511',
  'dropbox sign':              'https://support.hellosign.com/hc/en-us/articles/360007357511',
  'lastpass families':         'https://support.lastpass.com/s/article/How-do-I-cancel-my-LastPass-subscription',
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns the direct cancellation URL, or null if the service is unknown. */
export function getCancelUrl(name: string): string | null {
  return CATALOG[name.toLowerCase().trim()] ?? null
}

/**
 * Returns a Google search URL for "how to cancel <name> subscription".
 * Always works — use this when getCancelUrl returns null.
 */
export function getFallbackSearchUrl(name: string): string {
  const q = encodeURIComponent(`how to cancel ${name} subscription`)
  return `https://www.google.com/search?q=${q}`
}
