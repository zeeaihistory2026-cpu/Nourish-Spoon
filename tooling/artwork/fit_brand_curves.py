"""Fit smooth cubic Bezier outlines to the existing jar lettering contours."""
import numpy as np


def unit(vector):
    length = np.linalg.norm(vector)
    return vector / length if length else np.zeros(2)


def evaluate(curve, u):
    v = 1 - u
    return v ** 3 * curve[0] + 3 * v * v * u * curve[1] + 3 * v * u * u * curve[2] + u ** 3 * curve[3]


def fit(points, left, right, tolerance):
    if len(points) == 2:
        length = np.linalg.norm(points[1] - points[0]) / 3
        return [[points[0], points[0] + left * length, points[-1] + right * length, points[-1]]]
    distances = np.linalg.norm(np.diff(points, axis=0), axis=1)
    parameters = np.concatenate(([0], np.cumsum(distances)))
    parameters /= parameters[-1]
    a = np.array([[left * 3 * (1 - u) ** 2 * u, right * 3 * (1 - u) * u ** 2] for u in parameters])
    residual = np.array([point - ((1 - u) ** 3 + 3 * (1 - u) ** 2 * u) * points[0] - (u ** 3 + 3 * (1 - u) * u ** 2) * points[-1] for point, u in zip(points, parameters)])
    matrix = np.einsum('nik,njk->ij', a, a)
    rhs = np.einsum('nik,nk->i', a, residual)
    try:
        alpha = np.linalg.solve(matrix, rhs)
    except np.linalg.LinAlgError:
        alpha = np.zeros(2)
    chord = np.linalg.norm(points[-1] - points[0])
    if min(alpha) < chord * 1e-6:
        alpha = np.array([chord / 3, chord / 3])
    curve = [points[0], points[0] + left * alpha[0], points[-1] + right * alpha[1], points[-1]]
    errors = np.array([np.linalg.norm(evaluate(curve, u) - point) ** 2 for point, u in zip(points, parameters)])
    split = int(np.argmax(errors))
    if errors[split] <= tolerance ** 2:
        return [curve]
    split = max(1, min(split, len(points) - 2))
    tangent = unit(points[split - 1] - points[split + 1])
    return fit(points[:split + 1], left, tangent, tolerance) + fit(points[split:], -tangent, right, tolerance)


def smooth_closed_outline(loop, factor):
    points = np.array(loop[:-1], dtype=float)
    # Suppress subpixel stair steps without changing the lettering's proportions.
    weights = np.exp(-np.arange(-5, 6) ** 2 / (2 * 2.2 ** 2))
    weights /= weights.sum()
    points = sum(weight * np.roll(points, offset, axis=0) for offset, weight in zip(range(-5, 6), weights))
    start = int(np.argmin(points[:, 0]))
    points = np.roll(points, -start, axis=0)
    opposite = int(np.argmax(np.linalg.norm(points - points[0], axis=1)))
    closed = np.vstack([points, points[0]])
    left = unit(closed[1] - closed[-2])
    middle = unit(closed[opposite - 1] - closed[opposite + 1])
    return fit(closed[:opposite + 1], left, middle, factor * 0.4) + fit(closed[opposite:], -middle, -left, factor * 0.4)
