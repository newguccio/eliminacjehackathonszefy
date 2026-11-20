# Ogarniacz

Planner dla studenta, który po wpisaniu terminu kolokwium rozkłada rozdziały na sesje nauki i pokazuje, kiedy zmieścić je między innymi zajęciami.

**[Uruchom Ogarniacz](index.html)** · **[Wypróbuj demo](Demo.html)** · **[Zobacz prezentację PDF](Prezentacja.pdf)**

## Jak uruchomić

Po pobraniu projektu otwórz plik `index.html` w przeglądarce. Aplikacja zawiera 20 przykładowych zadań. Możesz je zastąpić własnym plikiem przez menu Ustawienia lub przeciągając JSON na okno. Zadania zapisują się w tej przeglądarce. Przy przenoszeniu między urządzeniami użyj eksportu.

Do wspólnego pokazu otwórz `Demo.html`. Kolokwium zawsze wypada za tydzień od uruchomienia. Zmiany w demonstracji trwają do odświeżenia strony, a przycisk „Otwórz mój planner” wraca do własnych zadań. Klikalne odsyłacze do aplikacji uruchamiają ją po pobraniu plików lub na hostingu statycznym. GitHub w widoku kodu wyświetla zawartość pliku HTML.

Żeby sprawdzić tryb offline lub instalację, uruchom serwer w głównym folderze projektu:

```sh
python -m http.server 8000
```

Otwórz `http://localhost:8000/Ogarniacz/` i poczekaj na załadowanie aplikacji przed odłączeniem sieci. Na telefonie do instalacji użyj wersji udostępnionej przez HTTPS.

## Pokaz w dwie minuty

| Czas | Co pokazać |
|---|---|
| 0:00–0:25 | Otwórz demo. Kolokwium z sieci jest za tydzień. Wcześniej trzeba jeszcze oddać sprawozdanie i pokazać prototyp. |
| 0:25–1:05 | Kliknij **Rozpisz plan nauki**. Pokaż zakresy rozdziałów i próbny test. Wyłącz i włącz wybór lżejszych dni, żeby porównać datę sesji i przeczytać uzasadnienie. |
| 1:05–1:35 | Zatwierdź sesje i otwórz **Radar**. Przejdź do jednej sesji, żeby pokazać ćwiczenie przypominania z pamięci. |
| 1:35–2:00 | Otwórz **Postępy**. Trzy sesje nadal oznaczają jedno kolokwium. Pokaż, gdzie student może wyeksportować cały plan do JSON. |

## Wymagania z zadania

| Wymaganie | Gdzie |
|---|---|
| Lista zadań | Strona **Zadania** w trzech widokach: **Lista** (wyszukiwarka, filtry, sortowanie, grupy po terminie), **Tablica** (kolumny wg priorytetu, przeciąganie kart) i **Kalendarz** (miesiąc) |
| Dodawanie | Przycisk **+** (na komputerze także klawisz `N`) |
| Edycja | Stuknij zadanie |
| Wykreślanie i cofanie | Kółko przy zadaniu, przesunięcie w prawo albo „Cofnij” w powiadomieniu |
| Usuwanie | Przesunięcie w lewo albo przycisk „Usuń” w edycji. Po usunięciu pojawia się przycisk „Cofnij” |
| Wczytanie JSON | Ustawienia → „Wczytaj zadania z pliku JSON” albo przeciągnięcie pliku |
| Zapis JSON | Ustawienia → „Zapisz zadania do pliku JSON” (`zadania.json`) |

**Format pliku.** Import i eksport zachowują wartości w poprawnym dokumencie `{"wersja": 1, "zadania": [...]}`, również przy pustym opisie, pustych tagach i terminie `null`. Wcięcia w zapisywanym JSON mogą się różnić. Wczytując listę, można ją dołączyć lub zastąpić obecną. Przy scalaniu Ogarniacz rozwiązuje konflikty identyfikatorów i aktualizuje odwołania sesji do kolokwiów. Zastąpienie listy rozpoczyna nową historię skupienia. Opcja „Cofnij” przywraca poprzedni stan. Dodatkowe pola zadań przechodzą przez import i eksport.

## Co tu jest „smart”: nasze pomysły

**1. Dodawanie zdaniem po polsku.** Piszesz `kolos z analizy w piątek !!! #studia // rozdziały 6–9`, a aplikacja sama ustawia termin, priorytet, tag i opis. Na bieżąco pokazuje, co rozpoznała. Rozpoznany fragment można odkliknąć, gdy się pomyliła. Rozumie: `dziś`, `jutro`, `pojutrze`, `w środę`, `do piątku`, `w przyszły poniedziałek`, `za 3 dni`, `za tydzień`, `w weekend`, `koniec miesiąca`, `5.12`, `28 stycznia`, `!`/`!!`/`!!!`, `pilne`, `#tag`.

**2. „Najlepiej zająć się teraz”.** Zamiast listy 20 rzeczy dostajesz jedną, z wyjaśnieniem dlaczego (np. „po terminie od wczoraj”, „wysoki priorytet”). Wynik to priorytet × pilność terminu. Sprawdziany dostają dodatkowe punkty kilka dni przed terminem, bo naukę trzeba zacząć wcześniej. Przycisk „Coś innego” pokazuje kolejną propozycję.

**3. Radar obciążenia.** Wykres najbliższych 14 dni. Kluczowa rzecz, której nie ma w zwykłych listach: kolokwium to nie tylko jeden dzień w kalendarzu, więc aplikacja dolicza trzy dni nauki przed nim (paski w kratkę). Dzięki temu widać, że „luźny” poniedziałek wcale nie jest luźny. Przeładowane dni świecą na czerwono.

**4. Odciążenie konkretnego dnia.** Gdy kilka sprawdzianów zbliża się jednocześnie, planer ostrzega o kumulacji. Dla przeciążonego dnia radar znajduje również jedną sprawę o niskim priorytecie, którą student może przełożyć. Pokazuje obie daty i przyjmuje decyzję użytkownika. Egzaminy i sesje nauki mają chronione terminy przy tej operacji.

**5. Plan nauki dopasowany do tygodnia.** Student podaje w opisie np. „Rozdziały 3–8”. Aplikacja rozdziela materiał, zostawia czas na powtórkę i porównuje sąsiednie dni z radarem. Jeżeli obok jest lżej i zostaje odstęp między sesjami, proponuje przesunięcie oraz wyjaśnia przyczynę. Daty można porównać przed zapisem. Rozpisane sesje zastępują szacunek przygotowania w radarze. Każda zawiera krótkie ćwiczenie z pamięci, a oryginalny termin kolokwium zostaje zachowany.

Pomysł na powtórki i ćwiczenia z pamięci czerpie z dwóch zaleceń dydaktycznych: rozłożenia nauki w czasie i przypominania sobie materiału przed zajrzeniem do notatek. Odstępy i sposób wyboru lżejszego dnia są regułami Ogarniacza. [Poradnik Institute of Education Sciences](https://ies.ed.gov/ncee/WWC/PracticeGuide/1/Published)

**6. Podpowiedź lżejszego dnia.** Przy wyborze terminu na dzień, który jest już zawalony, aplikacja to mówi i proponuje luźniejszy dzień wcześniej.

**7. Przegląd zaległości.** Zaległe zadania pokazuje po jednym, a przy każdym decydujesz szybko: zrobione, na dziś, na jutro, za tydzień, bez terminu albo „nieaktualne, usuń”. Na koniec dostajesz podsumowanie.

**8. Tryb skupienia.** Minutnik 15/25/50 minut przypisany do zadania. Działa też w tle (liczy od znacznika czasu), a po sesji pyta, czy zadanie jest zrobione. Zbiera czas poświęcony każdemu zadaniu.

**9. Podpowiedzi tagów, które się uczą.** Działają na słowniku studenckich słów i na twoich własnych zadaniach. Jeśli „laborka” zwykle miała `#lab`, nowa też dostanie taką podpowiedź. Słowa „kolokwium”, „egzamin” i „wejściówka” automatycznie podnoszą priorytet.

**10. Tablica i kalendarz.** Przeciągnięcie karty do innej kolumny zmienia priorytet, a upuszczenie jej w „Wykreślone” odhacza zadanie. Kalendarz pokazuje cały miesiąc, przeładowane dni podkreśla na czerwono, a stuknięcie dnia otwiera listę z tego dnia.

**11. Postępy.** Procent wykreślonych, seria dni z wykreślonym zadaniem, wykres ostatniego tygodnia, postęp według tagów i priorytetów oraz czas skupienia.

## Wygląd i tożsamość

Układ jest inspirowany narzędziami do notatek w stylu Notion: każda strona ma okładkę i ikonę, po lewej jest menu z tagami, a zadanie otwiera się jak strona z właściwościami (termin, priorytet, tagi, opis). Na tym kończą się podobieństwa. Wszystko, co widać, jest nasze:

- **Własne ilustracje** (budzik, notes, wykres z flagą, roślinka w doniczce i inne) rysowane od zera w SVG. Zmieniają kolory razem z trybem jasnym i ciemnym.
- **Okładki z zeszytu**: kratka i pociągnięcia zakreślaczem, inne dla każdej strony.
- **Priorytety jako zakreślacz** (różowy to wysoki, żółty średni), a zrobione zadanie jest dosłownie **wykreślane** animowaną kreską długopisu.
- Przeterminowane rzeczy są na czerwono, jak poprawki prowadzącego.

Na telefonie menu jest na dole, z ilustracjami zamiast ikon, a edycja wysuwa się od dołu. Na komputerze jest boczne menu ze ścieżką u góry, a edycja otwiera się w panelu z prawej. Do tego tryb ciemny, gesty (przesuń w prawo, żeby wykreślić, w lewo, żeby usunąć), zwijane sekcje, skróty klawiszowe (`N`, `/`, `1–4`), obsługa czytników ekranu i ograniczonego ruchu.

## Technicznie

- Jeden plik `index.html` (HTML, CSS i JavaScript bez bibliotek), do tego `manifest.webmanifest` i `sw.js` do instalacji i pracy offline.
- Dane są w `localStorage`. Plik JSON służy do przenoszenia zadań. Rzeczy spoza formatu (data wykreślenia, minuty skupienia) są trzymane osobno, żeby nie zmieniać formatu pliku.
- Daty liczone w czasie lokalnym (bez przesunięć UTC przy północy).

### Rozwijanie i sprawdzanie

Kod interfejsu i logika znajdują się w `Ogarniacz/zrodla/index.html`. Po zmianie szablonu albo danych przykładowych uruchom z katalogu głównego:

```sh
python Ogarniacz/zrodla/build.py
```

Skrypt odtwarza gotowy `Ogarniacz/index.html` przy użyciu biblioteki standardowej Pythona 3. Testy można uruchomić poleceniem `node --test` w głównym katalogu (sprawdzone w Node.js 22). Obejmują m.in. obcy JSON, konflikty ID, historię skupienia, daty planu nauki oraz wybór i cofnięcie przesunięcia.

## Ograniczenia i dalsze pomysły

Radar szacuje obciążenie na podstawie terminów i priorytetów. Dzień oceniony jako lekki może nadal zawierać zajęcia, których student nie wpisał. Synchronizacja między urządzeniami wymaga przeniesienia JSON. Historia minut skupienia jest lokalna.

W kolejnych wersjach chcielibyśmy dodać:


- Powiadomienia przed terminem (na iOS PWA wymagają serwera do Web Push).
- Szacowanie czasu zadań i układanie planu dnia w wolne godziny z planu zajęć (import z USOS).
- Wspólne zadania dla par projektowych.
