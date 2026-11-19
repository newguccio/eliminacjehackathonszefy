# Ogarniacz

Planner zadań dla studenta: kolokwia, projekty i codzienne sprawy. Działa jako aplikacja na iPhone'a (PWA: Safari → Udostępnij → „Do ekranu początkowego”), na Androidzie i w przeglądarce na komputerze. Działa też bez internetu.

## Jak uruchomić

Otwórz `index.html` w przeglądarce. To wystarczy, bo aplikacja nie ma zależności ani kroku budowania.
Żeby zainstalować ją na telefonie (z działaniem offline), wystaw folder przez HTTPS albo lokalnie:

```
python3 -m http.server 8000      # potem http://localhost:8000
```

Przy pierwszym uruchomieniu wczytuje się 20 przykładowych zadań. Własny plik wczytasz w Ustawieniach (ikona zębatki) albo przeciągając go na okno.

## Wymagania z zadania

| Wymaganie | Gdzie |
|---|---|
| Lista zadań | Strona **Zadania** w trzech widokach: **Lista** (wyszukiwarka, filtry, sortowanie, grupy po terminie), **Tablica** (kolumny wg priorytetu, przeciąganie kart) i **Kalendarz** (miesiąc) |
| Dodawanie | Przycisk **+** (na komputerze także klawisz `N`) |
| Edycja | Stuknij zadanie |
| Wykreślanie i cofanie | Kółko przy zadaniu, przesunięcie w prawo albo „Cofnij” w powiadomieniu |
| Usuwanie | Przesunięcie w lewo albo przycisk „Usuń” w edycji. Każdą zmianę można cofnąć |
| Wczytanie JSON | Ustawienia → „Wczytaj zadania z pliku JSON” albo przeciągnięcie pliku |
| Zapis JSON | Ustawienia → „Zapisz zadania do pliku JSON” (`zadania.json`) |

**Format pliku.** Zapis jest w dokładnie tym samym formacie i z tą samą kolejnością pól. Plik wczytany i od razu zapisany jest identyczny z oryginałem (sprawdzone testem). Nieznane dodatkowe pola są zachowywane. Uszkodzone dane (zła data, nieznany priorytet, powtórzone lub brakujące id, `null` zamiast opisu) są naprawiane, a aplikacja pokazuje, co poprawiła. Nie wywraca się przy tym.

## Co tu jest „smart”: nasze pomysły

**1. Dodawanie zdaniem po polsku.** Piszesz `kolos z analizy w piątek !!! #studia // rozdziały 6–9`, a aplikacja sama ustawia termin, priorytet, tag i opis. Na bieżąco pokazuje, co rozpoznała. Rozpoznany fragment można odkliknąć, gdy się pomyliła. Rozumie: `dziś`, `jutro`, `pojutrze`, `w środę`, `do piątku`, `w przyszły poniedziałek`, `za 3 dni`, `za tydzień`, `w weekend`, `koniec miesiąca`, `5.12`, `28 stycznia`, `!`/`!!`/`!!!`, `pilne`, `#tag`.

**2. „Najlepiej zająć się teraz”.** Zamiast listy 20 rzeczy dostajesz jedną, z wyjaśnieniem dlaczego (np. „po terminie od wczoraj”, „wysoki priorytet”). Wynik to priorytet × pilność terminu. Sprawdziany dostają dodatkowe punkty kilka dni przed terminem, bo naukę trzeba zacząć wcześniej. Przycisk „Coś innego” pokazuje kolejną propozycję.

**3. Radar obciążenia.** Wykres najbliższych 14 dni. Kluczowa rzecz, której nie ma w zwykłych listach: kolokwium to nie tylko jeden dzień w kalendarzu, więc aplikacja dolicza trzy dni nauki przed nim (paski w kratkę). Dzięki temu widać, że „luźny” poniedziałek wcale nie jest luźny. Przeładowane dni świecą na czerwono.

**4. Ostrzeżenia o kumulacji.** „3 sprawdziany w 4 dni” to sygnał, żeby zacząć naukę do późniejszego już teraz. Gdy tydzień jest przeładowany, aplikacja proponuje przesunąć zadania o niskim priorytecie o tydzień, jednym przyciskiem i z możliwością cofnięcia.

**5. Plan nauki do kolokwium.** Rozpisuje naukę na sesje 1, 3, 6 i 10 dni przed terminem (powtórki rozłożone w czasie). Jeśli w opisie są „Rozdziały 6–9”, dzieli je między sesje, a ostatnia sesja to powtórka całości i próbny test. Sesje są zwykłymi zadaniami w tym samym formacie JSON, więc plik zostaje zgodny.

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

## Co dalej, gdyby był czas

- Powiadomienia przed terminem (na iOS PWA wymagają serwera do Web Push).
- Szacowanie czasu zadań i układanie planu dnia w wolne godziny z planu zajęć (import z USOS).
- Wspólne zadania dla par projektowych.
