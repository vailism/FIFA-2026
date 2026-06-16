/* ============================================================
   FIFA World Cup 2026 — Main JavaScript
   Handles: Loading screen, navigation, countdown, data
   rendering, video player, scroll animations, and more.
   ============================================================ */

(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────────
       1. CONFIGURATION & DATA
       ───────────────────────────────────────────────────────── */

    /**
     * VIDEO_URL — Legally authorized DASH stream URL.
     * This is a DASH/MPD live stream that requires ClearKey DRM.
     * Replace with your own licensed stream URL as needed.
     */
    const VIDEO_URL = 'https://qp-pldt-live-bpk-ucd-prod.akamaized.net/bpk-tv/ch299/default/index.mpd';

    /**
     * JW_PLAYER_KEY — Valid JW Player 8.x license key.
     * When set, the site uses JW Player with full DASH + DRM support.
     * If left empty, it falls back to the built-in HTML5 player.
     */
    const JW_PLAYER_KEY = 'XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo';

    /**
     * JW_PLAYER_SDK_URL — CDN path to the JW Player library.
     * Version 8.21.0 is used to match the license key.
     */
    const JW_PLAYER_SDK_URL = 'https://ssl.p.jwpcdn.com/player/v/8.21.0/jwplayer.js';

    /**
     * DRM_CONFIG — ClearKey DRM credentials for the DASH stream.
     * keyId and key are hex-encoded as required by the EME spec.
     */
    const DRM_CONFIG = {
        clearkey: {
            keyId: '549ab7cd35a64bb6bb479ecead04d69d',
            key:   '829799ed534d11fcadeb4b192467e050'
        }
    };

    /**
     * NEXT_MATCH — Target date/time for the countdown timer.
     * Set this to the next scheduled kick-off (UTC).
     */
    const NEXT_MATCH = {
        teamA: 'Brazil',
        teamB: 'Germany',
        date: new Date('2026-06-20T18:00:00Z'),
        venue: 'MetLife Stadium, New York',
    };

    /**
     * TEAMS — Featured team data rendered as cards.
     * Uses Unicode flag emojis so no copyrighted images are needed.
     */
    const TEAMS = [
        { name: 'Brazil',      flag: '🇧🇷', group: 'Group A', wins: 5, draws: 0, goals: 12 },
        { name: 'Germany',     flag: '🇩🇪', group: 'Group A', wins: 4, draws: 1, goals: 10 },
        { name: 'Argentina',   flag: '🇦🇷', group: 'Group B', wins: 4, draws: 1, goals: 9 },
        { name: 'France',      flag: '🇫🇷', group: 'Group B', wins: 3, draws: 2, goals: 8 },
        { name: 'England',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'Group C', wins: 3, draws: 1, goals: 7 },
        { name: 'Spain',       flag: '🇪🇸', group: 'Group C', wins: 4, draws: 0, goals: 11 },
        { name: 'Netherlands', flag: '🇳🇱', group: 'Group D', wins: 3, draws: 2, goals: 8 },
        { name: 'Portugal',    flag: '🇵🇹', group: 'Group D', wins: 3, draws: 1, goals: 7 },
        { name: 'USA',         flag: '🇺🇸', group: 'Group E', wins: 2, draws: 2, goals: 6 },
        { name: 'Mexico',      flag: '🇲🇽', group: 'Group E', wins: 2, draws: 1, goals: 5 },
        { name: 'Canada',      flag: '🇨🇦', group: 'Group F', wins: 1, draws: 2, goals: 4 },
        { name: 'Japan',       flag: '🇯🇵', group: 'Group F', wins: 3, draws: 1, goals: 7 },
    ];

    /**
     * FIXTURES — Match fixtures & results data.
     * status: 'upcoming' | 'ft' (full-time)
     */
    const FIXTURES = [
        // Upcoming
        { teamA: 'Brazil',    flagA: '🇧🇷', teamB: 'Germany',   flagB: '🇩🇪', score: null,    time: '18:00 UTC', date: 'Jun 20', status: 'upcoming', venue: 'MetLife Stadium' },
        { teamA: 'Argentina', flagA: '🇦🇷', teamB: 'France',    flagB: '🇫🇷', score: null,    time: '21:00 UTC', date: 'Jun 21', status: 'upcoming', venue: 'AT&T Stadium' },
        { teamA: 'Spain',     flagA: '🇪🇸', teamB: 'England',   flagB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', score: null, time: '15:00 UTC', date: 'Jun 22', status: 'upcoming', venue: 'Azteca Stadium' },
        { teamA: 'USA',       flagA: '🇺🇸', teamB: 'Japan',     flagB: '🇯🇵', score: null,    time: '20:00 UTC', date: 'Jun 23', status: 'upcoming', venue: 'SoFi Stadium' },
        // Results
        { teamA: 'Portugal',  flagA: '🇵🇹', teamB: 'Netherlands', flagB: '🇳🇱', score: '2 - 1', time: 'FT',       date: 'Jun 15', status: 'ft', venue: 'BMO Field' },
        { teamA: 'Mexico',    flagA: '🇲🇽', teamB: 'Canada',    flagB: '🇨🇦', score: '1 - 0', time: 'FT',       date: 'Jun 14', status: 'ft', venue: 'Azteca Stadium' },
        { teamA: 'Brazil',    flagA: '🇧🇷', teamB: 'Japan',     flagB: '🇯🇵', score: '3 - 1', time: 'FT',       date: 'Jun 13', status: 'ft', venue: 'Rose Bowl' },
        { teamA: 'France',    flagA: '🇫🇷', teamB: 'Germany',   flagB: '🇩🇪', score: '2 - 2', time: 'FT',       date: 'Jun 12', status: 'ft', venue: 'MetLife Stadium' },
    ];

    /**
     * LIVE_MATCHES — Placeholder data for the live-score ticker.
     * In a real application this would be fetched from an API.
     */
    const LIVE_MATCHES = [
        { teamA: 'Brazil',  flagA: '🇧🇷', teamB: 'Portugal', flagB: '🇵🇹', scoreA: 2, scoreB: 1, minute: "62'" },
        { teamA: 'Spain',   flagA: '🇪🇸', teamB: 'Japan',    flagB: '🇯🇵', scoreA: 0, scoreB: 0, minute: "34'" },
        { teamA: 'USA',     flagA: '🇺🇸', teamB: 'Mexico',   flagB: '🇲🇽', scoreA: 1, scoreB: 1, minute: "78'" },
    ];

    /* ─────────────────────────────────────────────────────────
       1b. DYNAMIC DATA CONFIGURATIONS & MUTABLE STATE
       ───────────────────────────────────────────────────────── */

    // Dictionary mapping German team names to English names & Unicode flag emojis.
    // Covers all 48 qualified countries in the OpenLigaDB World Cup 2026 dataset.
    const TEAM_TRANSLATIONS = {
        'Algerien': { name: 'Algeria', flag: '🇩🇿' },
        'Argentinien': { name: 'Argentina', flag: '🇦🇷' },
        'Australien': { name: 'Australia', flag: '🇦🇺' },
        'Belgien': { name: 'Belgium', flag: '🇧🇪' },
        'Bosnien-Herzegowina': { name: 'Bosnia & Herz.', flag: '🇧🇦' },
        'Brasilien': { name: 'Brazil', flag: '🇧🇷' },
        'Curaçao': { name: 'Curaçao', flag: '🇨🇼' },
        'DR Kongo': { name: 'DR Congo', flag: '🇨🇩' },
        'Deutschland': { name: 'Germany', flag: '🇩🇪' },
        'Ecuador': { name: 'Ecuador', flag: '🇪🇨' },
        'Elfenbeinküste': { name: 'Ivory Coast', flag: '🇨🇮' },
        'England': { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        'Frankreich': { name: 'France', flag: '🇫🇷' },
        'Ghana': { name: 'Ghana', flag: '🇬🇭' },
        'Haiti': { name: 'Haiti', flag: '🇭🇹' },
        'Irak': { name: 'Iraq', flag: '🇮🇶' },
        'Iran': { name: 'Iran', flag: '🇮🇷' },
        'Japan': { name: 'Japan', flag: '🇯🇵' },
        'Jordanien': { name: 'Jordan', flag: '🇯🇴' },
        'Kanada': { name: 'Canada', flag: '🇨🇦' },
        'Kap Verde': { name: 'Cape Verde', flag: '🇨🇻' },
        'Katar': { name: 'Qatar', flag: '🇶🇦' },
        'Kolumbien': { name: 'Colombia', flag: '🇨🇴' },
        'Kroatien': { name: 'Croatia', flag: '🇭🇷' },
        'Marokko': { name: 'Morocco', flag: '🇲🇦' },
        'Mexiko': { name: 'Mexico', flag: '🇲🇽' },
        'Neuseeland': { name: 'New Zealand', flag: '🇳🇿' },
        'Niederlande': { name: 'Netherlands', flag: '🇳🇱' },
        'Norwegen': { name: 'Norway', flag: '🇳🇴' },
        'Panama': { name: 'Panama', flag: '🇵🇦' },
        'Paraguay': { name: 'Paraguay', flag: '🇵🇾' },
        'Portugal': { name: 'Portugal', flag: '🇵🇹' },
        'Saudi-Arabien': { name: 'Saudi Arabia', flag: '🇸🇦' },
        'Schottland': { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
        'Schweden': { name: 'Sweden', flag: '🇸🇪' },
        'Schweiz': { name: 'Switzerland', flag: '🇨🇭' },
        'Senegal': { name: 'Senegal', flag: '🇸🇳' },
        'Spanien': { name: 'Spain', flag: '🇪🇸' },
        'Südafrika': { name: 'South Africa', flag: '🇿🇦' },
        'Südkorea': { name: 'South Korea', flag: '🇰🇷' },
        'Tschechien': { name: 'Czechia', flag: '🇨🇿' },
        'Tunesien': { name: 'Tunisia', flag: '🇹🇳' },
        'Türkei': { name: 'Turkey', flag: '🇹🇷' },
        'USA': { name: 'USA', flag: '🇺🇸' },
        'Uruguay': { name: 'Uruguay', flag: '🇺🇾' },
        'Usbekistan': { name: 'Uzbekistan', flag: '🇺🇿' },
        'Ägypten': { name: 'Egypt', flag: '🇪🇬' },
        'Österreich': { name: 'Austria', flag: '🇦🇹' }
    };

    // Deterministic World Cup 2026 stadium allocation list
    const STADIUMS = [
        'MetLife Stadium, East Rutherford',
        'SoFi Stadium, Los Angeles',
        'AT&T Stadium, Dallas',
        'Estadio Azteca, Mexico City',
        'BMO Field, Toronto',
        'BC Place, Vancouver',
        'Mercedes-Benz Stadium, Atlanta',
        'Hard Rock Stadium, Miami',
        'Arrowhead Stadium, Kansas City',
        'NRG Stadium, Houston',
        'Lincoln Financial Field, Philadelphia',
        'Lumen Field, Seattle',
        'Levi\'s Stadium, Santa Clara',
        'Gillette Stadium, Boston',
        'Estadio BBVA, Monterrey',
        'Estadio Akron, Guadalajara'
    ];

    // Static mapping of group clusters based on tournament scheduling
    const TEAM_GROUPS = {
        'Mexiko': 'Group A', 'Südafrika': 'Group A', 'Südkorea': 'Group A', 'Tschechien': 'Group A',
        'Kanada': 'Group B', 'Bosnien-Herzegowina': 'Group B', 'Katar': 'Group B', 'Schweiz': 'Group B',
        'USA': 'Group C', 'Paraguay': 'Group C', 'Australien': 'Group C', 'Türkei': 'Group C',
        'Brasilien': 'Group D', 'Marokko': 'Group D', 'Haiti': 'Group D', 'Schottland': 'Group D',
        'Deutschland': 'Group E', 'Curaçao': 'Group E', 'Elfenbeinküste': 'Group E', 'Ecuador': 'Group E',
        'Niederlande': 'Group F', 'Japan': 'Group F', 'Schweden': 'Group F', 'Tunesien': 'Group F',
        'Spanien': 'Group G', 'Kap Verde': 'Group G', 'Saudi-Arabien': 'Group G', 'Uruguay': 'Group G',
        'Belgien': 'Group H', 'Ägypten': 'Group H', 'Iran': 'Group H', 'Neuseeland': 'Group H',
        'Frankreich': 'Group I', 'Senegal': 'Group I', 'Irak': 'Group I', 'Norwegen': 'Group I',
        'Argentinien': 'Group J', 'Algerien': 'Group J', 'Österreich': 'Group J', 'Jordanien': 'Group J',
        'Portugal': 'Group K', 'DR Kongo': 'Group K', 'Usbekistan': 'Group K', 'Kolumbien': 'Group K',
        'England': 'Group L', 'Kroatien': 'Group L', 'Ghana': 'Group L', 'Panama': 'Group L'
    };

    // Helper function to translate German team names to English
    function translateTeam(germanName) {
        return TEAM_TRANSLATIONS[germanName] || { name: germanName, flag: '⚽' };
    }

    // Mutable state arrays defaulting to initial static structures as fallback
    let teamsData = [...TEAMS];
    let fixturesData = [...FIXTURES];
    let liveMatchesData = [...LIVE_MATCHES];
    let nextMatchData = { ...NEXT_MATCH };
    let currentFixturesTab = 'upcoming';
    let currentStandingsFilter = 'all';


    /* ─────────────────────────────────────────────────────────
       2. DOM REFERENCES
       ───────────────────────────────────────────────────────── */

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const loadingScreen    = $('#loading-screen');
    const loadingBarFill   = $('#loading-bar-fill');
    const mainNav          = $('#main-nav');
    const navLinks         = $('#nav-links');
    const navHamburger     = $('#nav-hamburger');
    const teamsGrid        = $('#teams-grid');
    const fixturesList     = $('#fixtures-list');
    const fixturesTabs     = $('#fixtures-tabs');
    const liveTicker       = $('#live-ticker');

    // Countdown
    const cdDays    = $('#cd-days');
    const cdHours   = $('#cd-hours');
    const cdMinutes = $('#cd-minutes');
    const cdSeconds = $('#cd-seconds');
    const cdTeamA   = $('#countdown-team-a');
    const cdTeamB   = $('#countdown-team-b');
    const cdVenue   = $('#countdown-venue');

    // Video player
    const videoContainer   = $('#video-container');
    const video            = $('#main-video');
    const videoControls    = $('#video-controls');
    const videoBigPlay     = $('#video-big-play');
    const vcPlay           = $('#vc-play');
    const vcMute           = $('#vc-mute');
    const vcVolume         = $('#vc-volume');
    const vcTime           = $('#vc-time');
    const vcPip            = $('#vc-pip');
    const vcFullscreen     = $('#vc-fullscreen');
    const videoProgress    = $('#video-progress');
    const videoProgressFill = $('#video-progress-filled');


    /* ─────────────────────────────────────────────────────────
       3. LOADING SCREEN
       ───────────────────────────────────────────────────────── */

    /**
     * Simulates a loading progress bar, then reveals the page.
     */
    function initLoadingScreen() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 18 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Small delay before hiding for polish
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.classList.add('loaded');
                }, 400);
            }
            loadingBarFill.style.width = progress + '%';
        }, 200);
    }


    /* ─────────────────────────────────────────────────────────
       4. NAVIGATION
       ───────────────────────────────────────────────────────── */

    /**
     * Toggles the mobile nav drawer and hamburger animation.
     */
    function initNavigation() {
        // Hamburger toggle
        navHamburger.addEventListener('click', () => {
            const isOpen = navHamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            navHamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile nav when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navHamburger.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Shrink nav on scroll
        window.addEventListener('scroll', () => {
            mainNav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

        // Active link highlight based on scroll position
        const sections = $$('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                }
            });
        }, { threshold: 0.35 });

        sections.forEach(sec => observer.observe(sec));
    }


    /* ─────────────────────────────────────────────────────────
       5. COUNTDOWN TIMER
       ───────────────────────────────────────────────────────── */

    /**
     * Updates the countdown display every second.
     */
    function initCountdown() {
        function tick() {
            // Populate match info dynamically on every tick
            cdTeamA.textContent = nextMatchData.teamA;
            cdTeamB.textContent = nextMatchData.teamB;
            cdVenue.textContent = nextMatchData.venue;

            const now  = new Date();
            const diff = nextMatchData.date - now;

            if (diff <= 0) {
                // Match has started
                cdDays.textContent    = '00';
                cdHours.textContent   = '00';
                cdMinutes.textContent = '00';
                cdSeconds.textContent = '00';
                
                const grid = document.getElementById('countdown-grid');
                if (grid) {
                    grid.style.display = 'none';
                }
                
                let liveBtn = document.getElementById('countdown-live-btn');
                if (!liveBtn && grid) {
                    liveBtn = document.createElement('a');
                    liveBtn.id = 'countdown-live-btn';
                    liveBtn.href = '#live-scores';
                    liveBtn.className = 'btn live-match-btn animate-on-scroll';
                    liveBtn.innerHTML = '<span class="live-pulse">🔴</span> MATCH IS LIVE — VIEW LIVE SCORES';
                    grid.parentNode.insertBefore(liveBtn, grid.nextSibling);
                    initScrollAnimations();
                }
                return;
            } else {
                const grid = document.getElementById('countdown-grid');
                if (grid) {
                    grid.style.display = 'flex';
                }
                const liveBtn = document.getElementById('countdown-live-btn');
                if (liveBtn) {
                    liveBtn.remove();
                }
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            cdDays.textContent    = String(d).padStart(2, '0');
            cdHours.textContent   = String(h).padStart(2, '0');
            cdMinutes.textContent = String(m).padStart(2, '0');
            cdSeconds.textContent = String(s).padStart(2, '0');
        }

        tick();
        setInterval(tick, 1000);
    }


    /* ─────────────────────────────────────────────────────────
       6. TEAM CARDS
       ───────────────────────────────────────────────────────── */

    /**
     * Renders team cards into the grid from the TEAMS data array.
     */
    function renderTeams() {
        const groups = {};
        teamsData.forEach(team => {
            if (currentStandingsFilter === 'all' || team.group === currentStandingsFilter) {
                if (!groups[team.group]) {
                    groups[team.group] = [];
                }
                groups[team.group].push(team);
            }
        });

        const sortedGroupKeys = Object.keys(groups).sort();

        if (sortedGroupKeys.length === 0) {
            teamsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: var(--space-xl);">
                    No standings available for this filter.
                </div>
            `;
            return;
        }

        teamsGrid.innerHTML = sortedGroupKeys.map(grpKey => {
            const groupTeams = groups[grpKey];
            
            // Sort teams within the group by points descending, then wins, then alphabetically
            groupTeams.sort((a, b) => {
                const ptsA = a.points !== undefined ? a.points : (a.wins * 3 + a.draws);
                const ptsB = b.points !== undefined ? b.points : (b.wins * 3 + b.draws);
                return ptsB - ptsA || b.wins - a.wins || a.name.localeCompare(b.name);
            });

            const rowsHTML = groupTeams.map((team, index) => {
                const played = team.played !== undefined ? team.played : (team.wins + team.draws + (5 - team.wins));
                const points = team.points !== undefined ? team.points : (team.wins * 3 + team.draws);
                
                return `
                    <tr>
                        <td class="group-table-rank">${index + 1}</td>
                        <td>
                            <div class="group-table-team">
                                <span class="group-table-flag">${team.flag}</span>
                                <span>${team.name}</span>
                            </div>
                        </td>
                        <td>${played}</td>
                        <td>${team.wins}</td>
                        <td>${team.draws}</td>
                        <td class="group-table-pts">${points}</td>
                    </tr>
                `;
            }).join('');

            return `
                <div class="group-card animate-on-scroll">
                    <h3 class="group-card-title">${grpKey}</h3>
                    <table class="group-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Team</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th style="color: var(--gold);">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('');
    }


    /* ─────────────────────────────────────────────────────────
       7. FIXTURES & RESULTS
       ───────────────────────────────────────────────────────── */

    /**
     * Renders fixture cards filtered by the active tab.
     * @param {'upcoming' | 'results'} tab — The active filter tab
     */
    function renderFixtures(tab = 'upcoming') {
        const filtered = fixturesData.filter(f =>
            tab === 'upcoming' ? f.status === 'upcoming' : f.status === 'ft'
        );

        fixturesList.innerHTML = filtered.map(f => `
            <div class="fixture-card animate-on-scroll">
                <div class="fixture-team home">
                    <span class="fixture-flag">${f.flagA}</span>
                    <span>${f.teamA}</span>
                </div>
                <div class="fixture-centre">
                    ${f.score
                        ? `<span class="fixture-score">${f.score}</span>`
                        : `<span class="fixture-time">${f.time}</span>`
                    }
                    <span class="fixture-date">${f.date}</span>
                    <span class="fixture-status ${f.status}">${f.status === 'ft' ? 'Full Time' : 'Upcoming'}</span>
                </div>
                <div class="fixture-team away">
                    <span>${f.teamB}</span>
                    <span class="fixture-flag">${f.flagB}</span>
                </div>
            </div>
        `).join('');

        // Re-observe new elements for scroll animation
        initScrollAnimations();
    }

    /**
     * Sets up tab switching for Upcoming / Results.
     */
    function initFixtureTabs() {
        fixturesTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.fixtures-tab');
            if (!tab) return;

            // Update active state
            fixturesTabs.querySelectorAll('.fixtures-tab').forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            currentFixturesTab = tab.dataset.tab;
            renderFixtures(currentFixturesTab);
        });
    }

    /**
     * Sets up standings filter button click handlers.
     */
    function initGroupFilter() {
        const filterBar = document.getElementById('standings-filter');
        if (!filterBar) return;
        filterBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentStandingsFilter = btn.dataset.group;
            renderTeams();
        });
    }


    /* ─────────────────────────────────────────────────────────
       8. LIVE SCORES
       ───────────────────────────────────────────────────────── */

    /**
     * Renders the live-score ticker cards from liveMatchesData.
     */
    function renderLiveScores() {
        liveTicker.innerHTML = liveMatchesData.map(m => {
            const isUpcoming = m.minute === 'Upcoming';
            const isFT = m.minute === 'FT';
            
            let badgeHTML = '';
            if (isUpcoming) {
                badgeHTML = `
                    <span class="live-badge upcoming" style="background: var(--gold-dim); color: var(--gold);">
                        UPCOMING
                    </span>
                `;
            } else if (isFT) {
                badgeHTML = `
                    <span class="live-badge ft" style="background: rgba(46, 204, 113, 0.15); color: var(--green);">
                        FINISHED
                    </span>
                `;
            } else {
                badgeHTML = `
                    <span class="live-badge">
                        <span class="live-badge-dot"></span>
                        LIVE
                    </span>
                `;
            }

            const timeStr = isUpcoming ? (m.kickoffStr || m.minute) : m.minute;
            
            return `
                <div class="live-card animate-on-scroll">
                    <div class="live-card-header">
                        ${badgeHTML}
                        <span class="live-minute">${timeStr}</span>
                    </div>
                    <div class="live-match">
                        <div class="live-team">
                            <span class="live-team-flag">${m.flagA}</span>
                            <span class="live-team-name">${m.teamA}</span>
                        </div>
                        <span class="live-score-display">${isUpcoming ? 'vs' : `${m.scoreA} - ${m.scoreB}`}</span>
                        <div class="live-team">
                            <span class="live-team-flag">${m.flagB}</span>
                            <span class="live-team-name">${m.teamB}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }


    /* ─────────────────────────────────────────────────────────
       9. VIDEO PLAYER
       Dual-mode: JW Player (DASH + ClearKey DRM) when a valid
       license key is provided, otherwise custom HTML5 player.
       ───────────────────────────────────────────────────────── */

    /**
     * Dynamically loads an external <script> and returns a Promise
     * that resolves when the script has finished loading.
     * @param {string} src — URL of the script to load
     * @returns {Promise<void>}
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = resolve;
            s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(s);
        });
    }

    /**
     * Initialise the video player.
     * If JW_PLAYER_KEY is set, loads the JW Player SDK from CDN,
     * replaces the HTML5 <video> element with a JW Player instance
     * configured for DASH playback with ClearKey DRM.
     * Otherwise falls back to the custom HTML5 controls.
     */
    async function initVideoPlayer() {

        // Check for iOS Safari when playing DASH stream (.mpd)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS && VIDEO_URL && VIDEO_URL.endsWith('.mpd')) {
            const errorOverlay = document.getElementById('video-error-overlay');
            if (errorOverlay) {
                errorOverlay.classList.remove('hidden');
            }
            videoBigPlay.style.display = 'none';
            console.warn('[VideoPlayer] DASH stream is unsupported on iOS Safari. Displaying warning overlay.');
            return;
        }

        /* ── JW PLAYER PATH ───────────────────────────────── */
        if (JW_PLAYER_KEY && VIDEO_URL) {
            try {
                // 1. Load the JW Player SDK from CDN
                await loadScript(JW_PLAYER_SDK_URL);

                // 2. Set the license key
                if (typeof jwplayer !== 'undefined') {
                    jwplayer.key = JW_PLAYER_KEY;
                } else {
                    throw new Error('jwplayer global not found after SDK load');
                }

                // 3. Hide custom HTML5 controls (JW provides its own)
                videoControls.style.display = 'none';
                videoBigPlay.style.display  = 'none';

                // 4. Initialise JW Player on the existing <video> element
                const jwInstance = jwplayer('main-video');
                jwInstance.setup({
                    playlist: [{
                        title: 'FIFA World Cup 2026 — Live',
                        sources: [{
                            default: false,
                            type: 'dash',
                            file: VIDEO_URL,
                            drm: DRM_CONFIG,
                            label: '0'
                        }]
                    }],
                    width:       '100%',
                    height:      '100%',
                    aspectratio: '16:9',
                    autostart:   true,
                    cast:    {},   // Chromecast support
                    sharing: {},   // Social sharing overlay
                    logo: {
                        file:     '',          // No logo image
                        link:     '',
                        position: 'top-right'
                    }
                });

                console.info('[VideoPlayer] JW Player initialised with DASH + ClearKey DRM.');
                return; // All done — skip HTML5 fallback

            } catch (err) {
                // If JW Player fails to load, fall through to HTML5
                console.warn('[VideoPlayer] JW Player failed, falling back to HTML5:', err);
            }
        }

        /* ── HTML5 FALLBACK PATH ───────────────────────────── */
        if (VIDEO_URL) {
            if (VIDEO_URL.endsWith('.mpd')) {
                try {
                    // Dynamically load dash.js player library from CDN
                    await loadScript('https://cdn.dashjs.org/latest/dash.all.min.js');
                    if (typeof dashjs !== 'undefined') {
                        const player = dashjs.MediaPlayer().create();
                        player.initialize(video, VIDEO_URL, false);
                        
                        // Set up protection data for DRM ClearKey credentials inside dash.js
                        player.setProtectionData({
                            "org.w3.clearkey": {
                                "clearkey": {
                                    "549ab7cd35a64bb6bb479ecead04d69d": "829799ed534d11fcadeb4b192467e050"
                                }
                            }
                        });
                        console.info('[VideoPlayer] Fallback HTML5 Player initialized with dash.js and ClearKey DRM.');
                    } else {
                        throw new Error('dashjs global not found after SDK load');
                    }
                } catch (dashErr) {
                    console.error('[VideoPlayer] dash.js load/initialization failed:', dashErr);
                    video.src = VIDEO_URL;
                }
            } else {
                video.src = VIDEO_URL;
            }
        }

        // — Helpers —
        const playIcon  = vcPlay.querySelector('.play-icon');
        const pauseIcon = vcPlay.querySelector('.pause-icon');
        const volOn     = vcMute.querySelector('.vol-on');
        const volOff    = vcMute.querySelector('.vol-off');
        const fsEnter   = vcFullscreen.querySelector('.fs-enter');
        const fsExit    = vcFullscreen.querySelector('.fs-exit');

        /** Format seconds into m:ss or h:mm:ss */
        function fmt(secs) {
            if (isNaN(secs)) return '0:00';
            const h = Math.floor(secs / 3600);
            const m = Math.floor((secs % 3600) / 60);
            const s = Math.floor(secs % 60);
            if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            return `${m}:${String(s).padStart(2, '0')}`;
        }

        /** Toggle play / pause state */
        function togglePlay() {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        }

        /** Sync icon states with video */
        function updatePlayState() {
            const playing = !video.paused && !video.ended;
            playIcon.classList.toggle('hidden', playing);
            pauseIcon.classList.toggle('hidden', !playing);
            videoBigPlay.classList.toggle('hidden', playing);
        }

        // — Event listeners —

        // Play / pause via controls
        vcPlay.addEventListener('click', togglePlay);
        videoBigPlay.addEventListener('click', togglePlay);

        // Click on video area to toggle play
        video.addEventListener('click', togglePlay);

        // State syncing
        video.addEventListener('play', updatePlayState);
        video.addEventListener('pause', updatePlayState);
        video.addEventListener('ended', updatePlayState);

        // Progress bar update
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                videoProgressFill.style.width = pct + '%';
            }
            vcTime.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
        });

        // Seek via progress bar click
        videoProgress.addEventListener('click', (e) => {
            const rect = videoProgress.getBoundingClientRect();
            const pct  = (e.clientX - rect.left) / rect.width;
            video.currentTime = pct * video.duration;
        });

        // Volume control
        vcVolume.addEventListener('input', () => {
            video.volume = parseFloat(vcVolume.value);
            video.muted  = video.volume === 0;
            volOn.classList.toggle('hidden', video.muted);
            volOff.classList.toggle('hidden', !video.muted);
        });

        // Mute toggle
        vcMute.addEventListener('click', () => {
            video.muted = !video.muted;
            volOn.classList.toggle('hidden', video.muted);
            volOff.classList.toggle('hidden', !video.muted);
            vcVolume.value = video.muted ? 0 : video.volume;
        });

        // Fullscreen
        vcFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                videoContainer.requestFullscreen().catch(() => {});
                fsEnter.classList.add('hidden');
                fsExit.classList.remove('hidden');
            } else {
                document.exitFullscreen();
                fsEnter.classList.remove('hidden');
                fsExit.classList.add('hidden');
            }
        });

        document.addEventListener('fullscreenchange', () => {
            const isFull = !!document.fullscreenElement;
            fsEnter.classList.toggle('hidden', isFull);
            fsExit.classList.toggle('hidden', !isFull);
        });

        // Picture-in-Picture (if supported)
        if ('pictureInPictureEnabled' in document && document.pictureInPictureEnabled) {
            vcPip.addEventListener('click', async () => {
                try {
                    if (document.pictureInPictureElement) {
                        await document.exitPictureInPicture();
                    } else {
                        await video.requestPictureInPicture();
                    }
                } catch (err) {
                    console.warn('PiP not available:', err);
                }
            });
        } else {
            // Hide PiP button if not supported
            vcPip.style.display = 'none';
        }

        // Auto-hide controls after inactivity
        let controlsTimeout;
        videoContainer.addEventListener('mousemove', () => {
            videoContainer.classList.add('show-controls');
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (!video.paused) {
                    videoContainer.classList.remove('show-controls');
                }
            }, 3000);
        });

        videoContainer.addEventListener('mouseleave', () => {
            if (!video.paused) {
                videoContainer.classList.remove('show-controls');
            }
        });

        // Keyboard shortcuts (space = play/pause, f = fullscreen, m = mute)
        document.addEventListener('keydown', (e) => {
            // Only respond when video section is in view
            const rect = videoContainer.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    vcFullscreen.click();
                    break;
                case 'm':
                    vcMute.click();
                    break;
            }
        });
    }


    /* ─────────────────────────────────────────────────────────
       10. SCROLL ANIMATIONS
       ───────────────────────────────────────────────────────── */

    /**
     * Uses IntersectionObserver to add .visible class to elements
     * marked with .animate-on-scroll once they enter the viewport.
     */
    function initScrollAnimations() {
        const els = $$('.animate-on-scroll:not(.visible)');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        els.forEach(el => observer.observe(el));
    }


    /* ─────────────────────────────────────────────────────────
       11. INITIALISATION
       ───────────────────────────────────────────────────────── */

    /**
     * Extracts final match score from the API results.
     */
    function getMatchScore(match) {
        if (!match.matchResults || match.matchResults.length === 0) {
            return null;
        }
        // Find final result ("Endergebnis"), order type 2, or take the last one in the results array
        const finalResult = match.matchResults.find(r => r.resultName === 'Endergebnis') || 
                            match.matchResults.find(r => r.resultOrderID === 2) ||
                            match.matchResults[match.matchResults.length - 1];
        if (finalResult) {
            return `${finalResult.pointsTeam1} - ${finalResult.pointsTeam2}`;
        }
        return null;
    }

    /**
     * Queries OpenLigaDB APIs to populate live scores, fixtures, standings, and countdown.
     */
    async function fetchDynamicData() {
        try {
            const [matchesRes, tableRes] = await Promise.all([
                fetch('https://api.openligadb.de/getmatchdata/wm2026/2026'),
                fetch('https://api.openligadb.de/getbltable/wm2026/2026')
            ]);

            if (!matchesRes.ok || !tableRes.ok) {
                throw new Error('API request failed');
            }

            const rawMatches = await matchesRes.json();
            const rawTable = await tableRes.json();

            if (!rawMatches || rawMatches.length === 0) {
                throw new Error('Empty matches returned');
            }

            // 1. Process Standings
            teamsData = rawTable.map(team => {
                const tr = translateTeam(team.teamName);
                const grp = TEAM_GROUPS[team.teamName] || 'Group A';
                return {
                    name: tr.name,
                    flag: tr.flag,
                    group: grp,
                    wins: team.won,
                    draws: team.draw,
                    goals: team.goals,
                    played: team.matches,
                    points: team.points
                };
            });

            // 2. Process Fixtures
            fixturesData = rawMatches.map(m => {
                const trA = translateTeam(m.team1.teamName);
                const trB = translateTeam(m.team2.teamName);
                const score = getMatchScore(m);
                const dateObj = new Date(m.matchDateTimeUTC);
                
                return {
                    teamA: trA.name,
                    flagA: trA.flag,
                    teamB: trB.name,
                    flagB: trB.flag,
                    score: score,
                    time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                    status: m.matchIsFinished ? 'ft' : 'upcoming',
                    venue: STADIUMS[m.matchID % STADIUMS.length],
                    dateTime: dateObj
                };
            });

            // 3. Dynamic Next Match Selection
            const now = new Date();
            const upcomingMatches = fixturesData.filter(f => f.dateTime > now);
            if (upcomingMatches.length > 0) {
                upcomingMatches.sort((a, b) => a.dateTime - b.dateTime);
                const next = upcomingMatches[0];
                nextMatchData = {
                    teamA: next.teamA,
                    teamB: next.teamB,
                    date: next.dateTime,
                    venue: next.venue
                };
            }

            // 4. Dynamic Live Match Filtering / Fallbacks
            const liveThreshold = 240 * 60 * 1000; // 4 hours to accommodate extra times/delays
            const liveList = rawMatches.filter(m => {
                const matchTime = new Date(m.matchDateTimeUTC);
                return !m.matchIsFinished && (now - matchTime >= 0) && (now - matchTime < liveThreshold);
            });

            if (liveList.length > 0) {
                liveMatchesData = liveList.map(m => {
                    const trA = translateTeam(m.team1.teamName);
                    const trB = translateTeam(m.team2.teamName);
                    const matchTime = new Date(m.matchDateTimeUTC);
                    const elapsedMin = Math.floor((now - matchTime) / 60000);
                    
                    let scoreA = 0;
                    let scoreB = 0;
                    if (m.matchResults && m.matchResults.length > 0) {
                        const latest = m.matchResults[m.matchResults.length - 1];
                        scoreA = latest.pointsTeam1;
                        scoreB = latest.pointsTeam2;
                    }
                    
                    return {
                        teamA: trA.name,
                        flagA: trA.flag,
                        teamB: trB.name,
                        flagB: trB.flag,
                        scoreA: scoreA,
                        scoreB: scoreB,
                        minute: `${elapsedMin}'`
                    };
                });
            } else {
                // If no active matches are playing, display the last 3 results & next 2 upcoming games
                const recentFinished = fixturesData
                    .filter(f => f.status === 'ft')
                    .sort((a, b) => b.dateTime - a.dateTime)
                    .slice(0, 3);

                const nextUpcoming = fixturesData
                    .filter(f => f.status === 'upcoming')
                    .sort((a, b) => a.dateTime - b.dateTime)
                    .slice(0, 2);

                const displayMatches = [...recentFinished, ...nextUpcoming];

                liveMatchesData = displayMatches.map(m => {
                    let scoreA = 0;
                    let scoreB = 0;
                    if (m.score) {
                        const parts = m.score.split('-').map(s => parseInt(s.trim()));
                        if (parts.length === 2) {
                            scoreA = parts[0];
                            scoreB = parts[1];
                        }
                    }

                    return {
                        teamA: m.teamA,
                        flagA: m.flagA,
                        teamB: m.teamB,
                        flagB: m.flagB,
                        scoreA: scoreA,
                        scoreB: scoreB,
                        minute: m.status === 'ft' ? 'FT' : 'Upcoming',
                        kickoffStr: `${m.date} ${m.time}`
                    };
                });
            }

            // Redraw content with fresh data
            renderTeams();
            renderFixtures(currentFixturesTab);
            renderLiveScores();
            
            // Re-observe newly injected nodes for scroll animations
            initScrollAnimations();

            // Update Sync Status Badge
            const syncStatus = document.getElementById('sync-status');
            if (syncStatus) {
                const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                syncStatus.textContent = `Last Synced: ${timeStr}`;
            }

        } catch (error) {
            console.warn('[DynamicData] Error fetching live scores/standings:', error);
            
            // Show status badge offline
            const syncStatus = document.getElementById('sync-status');
            if (syncStatus) {
                syncStatus.textContent = 'Sync Offline';
            }
        }
    }

    /**
     * Bootstrap everything once the DOM is ready.
     */
    function init() {
        initLoadingScreen();
        initNavigation();
        initCountdown();
        
        // Initial draw with static data
        renderTeams();
        renderFixtures('upcoming');
        initFixtureTabs();
        initGroupFilter();
        renderLiveScores();
        initVideoPlayer();
        initScrollAnimations();

        // Load dynamic data in background immediately
        fetchDynamicData();

        // Poll API every 30 seconds for live updates
        setInterval(fetchDynamicData, 30000);
    }

    // Kick off when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
