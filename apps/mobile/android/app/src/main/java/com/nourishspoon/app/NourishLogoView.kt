package com.nourishspoon.app

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PathMeasure
import android.os.Build
import android.provider.Settings
import android.util.AttributeSet
import android.view.View
import android.view.animation.LinearInterpolator
import androidx.core.graphics.PathParser
import androidx.core.content.res.ResourcesCompat
import org.json.JSONArray

/** Fixed gold mark with a one-second, letter-by-letter script wordmark. */
class NourishLogoView @JvmOverloads constructor(
  context: Context, attrs: AttributeSet? = null
) : View(context, attrs) {
  private data class Stroke(val path: Path, val measure: PathMeasure, val width: Float)
  private val strokes: List<Stroke> = context.resources.openRawResource(R.raw.nourish_logo_strokes).use { stream ->
    val records = JSONArray(stream.bufferedReader().readText())
    List(records.length()) { index ->
      val record = records.getJSONObject(index)
      val path = requireNotNull(PathParser.createPathFromPathData(record.getString("d")))
      Stroke(path, PathMeasure(path, false), if (record.getBoolean("tm")) 1.35f else 2.4f)
    }
  }
  private val totalLength = strokes.sumOf { it.measure.length.toDouble() }.toFloat()
  private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
    color = Color.rgb(201, 168, 76)
    style = Paint.Style.STROKE
    strokeCap = Paint.Cap.ROUND
    strokeJoin = Paint.Join.ROUND
  }
  private val segment = Path()
  private val wordmark = "Nourish Spoon"
  private val wordmarkPaint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.SUBPIXEL_TEXT_FLAG).apply {
    color = Color.rgb(201, 168, 76)
    typeface = requireNotNull(ResourcesCompat.getFont(context, R.font.nourish_launch_script))
    textSize = 34f
    isFakeBoldText = true
    style = Paint.Style.FILL
  }
  // Anchor to the complete phrase, not the changing prefix, to prevent sideways movement.
  private val wordmarkLeft = (224f - wordmarkPaint.measureText(wordmark)) / 2f
  private var visibleLetters = 0
  private var amount = 0f
  private var animator: ValueAnimator? = null
  private var started = false
  var complete = false
    private set
  var whenFinished: (() -> Unit)? = null

  fun startMotion() {
    if (started) return
    started = true
    val enabled = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ValueAnimator.areAnimatorsEnabled()
    } else {
      Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) > 0f
    }
    if (!enabled) { finish(); return }
    animator = ValueAnimator.ofFloat(0f, 3000f).apply {
      duration = 3000L
      interpolator = LinearInterpolator()
      addUpdateListener { animation ->
        val elapsed = animation.animatedValue as Float
        amount = ease((elapsed / 1400f).coerceIn(0f, 1f))
        visibleLetters = (((elapsed - 1400f) / 1000f) * wordmark.length).toInt().coerceIn(0, wordmark.length)
        invalidate()
      }
      addListener(object : AnimatorListenerAdapter() {
        override fun onAnimationEnd(animation: Animator) { finish() }
      })
      start()
    }
  }

  private fun ease(progress: Float) = progress * progress * (3f - 2f * progress)
  private fun finish() {
    amount = 1f
    visibleLetters = wordmark.length
    complete = true
    invalidate()
    val callback = whenFinished
    whenFinished = null
    callback?.invoke()
  }

  override fun onDraw(canvas: Canvas) {
    super.onDraw(canvas)
    val save = canvas.save()
    val scale = minOf(width / 224f, height / 264f)
    canvas.translate((width - 224f * scale) / 2f, (height - 264f * scale) / 2f)
    canvas.scale(scale, scale)
    var remaining = amount * totalLength
    for (stroke in strokes) {
      paint.strokeWidth = stroke.width
      val length = stroke.measure.length
      if (amount >= 1f || remaining >= length) {
        canvas.drawPath(stroke.path, paint)
      } else if (remaining > 0f) {
        segment.rewind()
        stroke.measure.getSegment(0f, remaining, segment, true)
        canvas.drawPath(segment, paint)
      }
      remaining -= length
    }
    if (visibleLetters > 0) {
      // Keep the full shaping context as letters appear, preserving script joins and kerning.
      canvas.drawTextRun(wordmark, 0, visibleLetters, 0, wordmark.length, wordmarkLeft, 224f, false, wordmarkPaint)
    }
    canvas.restoreToCount(save)
  }

  override fun onDetachedFromWindow() {
    whenFinished = null
    animator?.removeAllListeners()
    animator?.cancel()
    animator = null
    super.onDetachedFromWindow()
  }
}
