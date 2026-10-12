Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791825295720_9aaecca7.jpg"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$dirs = @(
    "public\reference",
    "public\world\regions",
    "public\characters",
    "public\pets\qyran",
    "public\buildings",
    "public\ui",
    "public\subjects",
    "public\effects",
    "public\game"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Copy-Item $srcPath "public\reference\reference-board.jpg" -Force

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $outPath) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $outPath ($($w)x$($h))"
}

# 1. Main World Map
Crop-Image 0 0 580 258 "public\world\main-map.png"

# 2. Region Backgrounds
Crop-Image 588 30 142 105 "public\world\regions\sandar-patshalygy.png"
Crop-Image 733 30 142 105 "public\world\regions\sozder-ormany.png"
Crop-Image 878 30 142 105 "public\world\regions\ertegiler-eli.png"
Crop-Image 588 145 142 105 "public\world\regions\zertteushiler-araly.png"
Crop-Image 733 145 142 105 "public\world\regions\english-town.png"
Crop-Image 878 145 142 105 "public\world\regions\digital-city.png"

# 3. Avatars
Crop-Image 8 280 236 142 "public\characters\avatars-lineup.png"
Crop-Image 12 280 56 115 "public\characters\boy-explorer.png"
Crop-Image 69 280 56 115 "public\characters\girl-explorer.png"
Crop-Image 126 280 56 115 "public\characters\boy-inventor.png"
Crop-Image 183 280 56 115 "public\characters\girl-inventor.png"

# 4. Qyran AI Companion
Crop-Image 245 275 272 150 "public\pets\qyran\qyran-showcase.png"
Crop-Image 248 275 125 145 "public\pets\qyran\qyran-hero.png"
Crop-Image 375 285 45 45 "public\pets\qyran\qyran-idle.png"
Crop-Image 425 285 45 45 "public\pets\qyran\qyran-happy.png"
Crop-Image 475 285 45 45 "public\pets\qyran\qyran-thinking.png"
Crop-Image 345 345 45 45 "public\pets\qyran\qyran-flying.png"
Crop-Image 395 345 45 45 "public\pets\qyran\qyran-explaining.png"
Crop-Image 440 345 45 45 "public\pets\qyran\qyran-celebrating.png"
Crop-Image 485 345 45 45 "public\pets\qyran\qyran-sleeping.png"

# 5. Buildings (My World / Village)
Crop-Image 525 275 495 150 "public\buildings\village-strip.png"
Crop-Image 530 280 235 65 "public\buildings\yurts-evolution.png"
Crop-Image 768 280 68 65 "public\buildings\library.png"
Crop-Image 840 280 68 65 "public\buildings\workshop.png"
Crop-Image 915 280 80 65 "public\buildings\stables.png"
Crop-Image 530 350 70 65 "public\buildings\qyran-house.png"
Crop-Image 605 350 70 65 "public\buildings\garden.png"
Crop-Image 680 350 70 65 "public\buildings\observatory.png"
Crop-Image 755 350 72 65 "public\buildings\science-center.png"
Crop-Image 830 350 82 65 "public\buildings\watermill.png"
Crop-Image 915 350 85 65 "public\buildings\bridge.png"

# 6. UI & HUD Elements
Crop-Image 10 445 340 125 "public\ui\ui-hud-kit.png"
Crop-Image 12 455 100 70 "public\ui\logo-shanyrak.png"
Crop-Image 195 480 145 70 "public\ui\player-card-hud.png"

# 7. Rewards & Achievements
Crop-Image 355 445 230 125 "public\ui\rewards-medals-kit.png"
Crop-Image 360 455 52 45 "public\ui\chest-wood.png"
Crop-Image 415 455 52 45 "public\ui\chest-silver.png"
Crop-Image 470 455 52 45 "public\ui\chest-gold.png"
Crop-Image 525 455 55 45 "public\ui\chest-legendary.png"

# 8. Subject Badges
Crop-Image 590 445 190 125 "public\subjects\subject-gems-kit.png"

# 9. Effects
Crop-Image 785 445 235 125 "public\effects\effects-kit.png"
Crop-Image 790 455 45 45 "public\effects\shanyrak-portal.png"
Crop-Image 840 455 45 45 "public\effects\stars-burst.png"
Crop-Image 890 455 45 45 "public\effects\golden-spark.png"
Crop-Image 940 455 45 45 "public\effects\confetti.png"

# 10. Game HUD & Kazakh Ornaments
Crop-Image 350 585 310 90 "public\game\game-hud-strip.png"
Crop-Image 355 590 105 45 "public\game\math-card.png"
Crop-Image 470 590 65 30 "public\game\boss-hearts.png"
Crop-Image 470 615 70 65 "public\game\qyran-dialogue.png"
Crop-Image 665 585 350 90 "public\ui\kazakh-ornaments.png"

$srcImg.Dispose()
Write-Host "All reference assets extracted successfully!"
