from sympy import *
t, th, x, a, r = symbols('t theta x a r', positive=True)
pr = lambda *s: print(*s)

def slope(X, Y, v): return simplify(diff(Y, v) / diff(X, v))

# P1 parametric basics: x=t^2-2t, y=t+1 -> x = y^2 - 4y + 3
y_ = symbols('y'); pr('P1 elim', expand(((y_ - 1)**2 - 2*(y_ - 1))))
# P2 classic curves: cycloid, astroid, involute
pr('P2 involute speed', simplify(sqrt(diff(a*(cos(t)+t*sin(t)), t)**2 + diff(a*(sin(t)-t*cos(t)), t)**2)))
# P3 Stewart 10.2 Ex1: x=t^2, y=t^3-3t
T = symbols('T', real=True); X, Y = T**2, T**3 - 3*T
m = slope(X, Y, T); pr('P3 dy/dx', m, [m.subs(T, s) for s in (sqrt(3), -sqrt(3))])
d2 = simplify(diff(m, T) / diff(X, T)); pr('P3 d2y', factor(d2))
pr('P3 horiz', solve(diff(Y, T), T), 'vert', solve(diff(X, T), T))
# P3 Ex2 cycloid tangent at theta=pi/3
pr('P3 cycloid slope', simplify((sin(th) / (1 - cos(th))).subs(th, pi/3)))
# P4 areas/lengths
pr('P4 cycloid area', integrate((r*(1-cos(th)))**2, (th, 0, 2*pi)))
pr('P4 cycloid arc', simplify(integrate(2*r*sin(th/2), (th, 0, 2*pi))))
ax, ay = a*cos(t)**3, a*sin(t)**3
pr('P4 astroid area', simplify(4*integrate(-ay*diff(ax, t), (t, 0, pi/2))))   # 3*pi*a^2/8
sp = simplify(sqrt(diff(ax, t)**2 + diff(ay, t)**2).subs(a, 1)); pr('P4 astroid speed', sp)
pr('P4 astroid length', 4*integrate(3*sin(t)*cos(t), (t, 0, pi/2)))             # 6 (a=1)
# P5 surfaces: sphere (Stewart 10.2 Ex6) and cycloid arch about x-axis
pr('P5 sphere', integrate(2*pi*r*sin(t)*r, (t, 0, pi)))
pr('P5 cycloid surf', simplify(integrate(2*pi*r*(1-cos(th))*2*r*sin(th/2), (th, 0, 2*pi))))  # 64 pi r^2/3
# P6 cubic Bezier: P0(0,0) P1(1,2) P2(3,2) P3(4,0), point at t=1/2, de Casteljau agrees
B = lambda p, s: sum((binomial(3, k)*(1-s)**(3-k)*s**k*Matrix(p[k]) for k in range(4)), zeros(2, 1))
P = [(0, 0), (1, 2), (3, 2), (4, 0)]; pr('P6 B(1/2)', B(P, Rational(1, 2)).T, 'B\'(0)/3', (diff(B(P, t), t).subs(t, 0)/3).T)
# P7 polar <-> cartesian: (2, pi/3) -> (1, sqrt3); (1,-1) -> (sqrt2, 7pi/4)
pr('P7', 2*cos(pi/3), 2*sin(pi/3), sqrt(2), atan2(-1, 1))
# P8 r=2cos(theta) is circle (x-1)^2+y^2=1
xx, yy = 2*cos(th)*cos(th), 2*cos(th)*sin(th); pr('P8 circle', simplify((xx-1)**2 + yy**2))
# P9 polar tangent, cardioid r=1+sin(theta) (Stewart 10.3 Ex9)
R = 1 + sin(th); dx = diff(R*cos(th), th); dy = diff(R*sin(th), th)
pr('P9 slope pi/3', simplify((dy/dx).subs(th, pi/3)))
pr('P9 dy=0', solve(simplify(dy), th), ' dx=0', solve(simplify(dx), th))
# P10 family r=1+c sin(theta): inner loop iff c>1 (r<0 somewhere)
pr('P10 roses: petals cos(n th): n odd -> n, n even -> 2n')
# P11 areas (Stewart 10.4 Ex1, Ex2), intersections Ex3, cardioid length
pr('P11 rose loop', integrate(cos(2*th)**2/2, (th, -pi/4, pi/4)))
pr('P11 circle-cardioid', integrate(((3*sin(th))**2 - (1+sin(th))**2)/2, (th, pi/6, 5*pi/6)))
pr('P11 cos2th=1/2', solve(Eq(cos(2*th), Rational(1, 2)), th))
pr('P11 cardioid len (1+cos)', integrate(2*cos(th/2), (th, 0, pi))*2)   # sqrt(r^2+r'^2)=2|cos(th/2)| -> 8
# P12 conics: 9x^2+16y^2=144 foci; 9x^2-16y^2=144 foci, asymptotes
pr('P12 ellipse c', sqrt(16-9), ' hyperbola c', sqrt(16+9), ' asym 3/4')
pr('P12 parabola x^2=4py, y=x^2/8 -> p=2')
# P13 curvature
xs = symbols('xs', real=True); f = xs**2
k = Abs(diff(f, xs, 2)) / (1 + diff(f, xs)**2)**Rational(3, 2); pr('P13 y=x^2 k(0)', k.subs(xs, 0), 'R', 1/k.subs(xs, 0), 'k(1)', simplify(k.subs(xs, 1)), N(k.subs(xs, 1), 4))
g = Rational(2, 5)*xs**2; kg = (Abs(diff(g, xs, 2)) / (1 + diff(g, xs)**2)**Rational(3, 2)).subs(xs, 0); pr('P13 Tongji y=0.4x^2 R', 1/kg)
A_, B_ = symbols('A B', positive=True)
ex, ey = A_*cos(t), B_*sin(t); kp = simplify((diff(ex, t)*diff(ey, t, 2) - diff(ex, t, 2)*diff(ey, t)) / (diff(ex, t)**2 + diff(ey, t)**2)**Rational(3, 2))
pr('P13 ellipse k(0)', simplify(kp.subs(t, 0)), ' k(pi/2)', simplify(kp.subs(t, pi/2)))
cx, cy = r*(t - sin(t)), r*(1 - cos(t))
kc = simplify((diff(cx, t)*diff(cy, t, 2) - diff(cx, t, 2)*diff(cy, t)) / (diff(cx, t)**2 + diff(cy, t)**2)**Rational(3, 2))
pr('P13 cycloid top R', simplify(1/kc.subs(t, pi)))   # 4r
# P14 polar conics (Stewart 10.6 Ex2, Ex3) + Kepler
pr('P14 r=10/(3-2cos): e=2/3 d=5 vertices', Rational(10, 1)/(3-2), Rational(10, 1)/(3+2))
pr('P14 r=12/(2+4sin): e=2 d=3 vertices', 12/(2+4), 12/(2-4))
aE, eE = 1.496e8, 0.017; pr('P14 earth peri/aph km', aE*(1-eE), aE*(1+eE))
# P15 quiz
pr('P15 ellipse 2cos,3sin area', integrate(-3*sin(t)*diff(2*cos(t), t), (t, 0, 2*pi)), ' r=2/(1+cos) e=1 parabola')
