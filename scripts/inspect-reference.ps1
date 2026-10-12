Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Aqparat7\.gemini\antigravity\brain\5fc40780-0863-46b3-9c6f-6f22d34661f9\.user_uploaded\media_1791827611264_f1f2a400.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Width: $($img.Width), Height: $($img.Height)"

# Sample background around section 1 (Qyran):
# Top left corner of Qyran area:
Write-Host "Color at (10, 10): $($img.GetPixel(10, 10))"
Write-Host "Color at (50, 50): $($img.GetPixel(50, 50))"
Write-Host "Color at (20, 100): $($img.GetPixel(20, 100))"
Write-Host "Color at (300, 30): $($img.GetPixel(300, 30))"
$img.Dispose()
