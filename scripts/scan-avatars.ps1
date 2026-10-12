Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

Write-Host "Scanning Section 2 (Avatars):"
# Avatars are at x=605..780, y=10..220.
# Let's inspect pill or label rows below characters (around y=140..170):
for ($y = 130; $y -lt 165; $y += 2) {
    $cBoy = $img.GetPixel(660, $y)
    $cGirl = $img.GetPixel(735, $y)
    Write-Host "y=$y : BoyCenter(660)=($($cBoy.R),$($cBoy.G),$($cBoy.B)) GirlCenter(735)=($($cGirl.R),$($cGirl.G),$($cGirl.B))"
}
$img.Dispose()
