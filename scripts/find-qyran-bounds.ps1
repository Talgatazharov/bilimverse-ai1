Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Check Section 1 header and positions:
# In section 1, width is 0..600, height is 0..220.
# Let's inspect where the label pills are located:
Write-Host "Finding pills row in Section 1:"
for ($y = 120; $y -lt 160; $y += 2) {
    # check color at x = 50 (Idle pill), x = 160 (Happy pill), x = 250 (Thinking pill), etc.
    $c = $img.GetPixel(50, $y)
    Write-Host "y=$y : at x=50 color=($($c.R),$($c.G),$($c.B))"
}
$img.Dispose()
